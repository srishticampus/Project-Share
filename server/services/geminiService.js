import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import Project from '../models/Project.js'; // Import Project model
import Task from '../models/Task.js'; // Import Task model
import User from '../models/user.js'; // Import User model

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define tools for function calling
/**@type {import('@google/generative-ai').Tool[]} */
const tools = [
    {
        functionDeclarations: [
            {
                name: "getProjectDetails",
                description: "Get details about a specific project by its ID. The project ID must be a valid MongoDB ObjectId obtained from 'listUserProjects' or 'searchUserProjects'. Do NOT ask the user for a project ID directly.",
                parameters: {
                    type: "object",
                    properties: {
                        projectId: {
                            type: "string",
                            description: "The ID of the project to retrieve details for."
                        }
                    },
                    required: ["projectId"]
                }
            },
            {
                name: "listUserProjects",
                description: "List all projects created by the current user. Use this when the user asks to see their projects or available projects. This function provides project IDs which can then be used with 'getProjectDetails'. Do NOT ask the user for any IDs.",
                parameters: {
                    type: "object",
                    properties: {} // No parameters needed from the LLM
                }
            },
            {
                name: "listProjectTasks",
                description: "List all tasks for a given project ID. Use this after identifying a project (using 'listUserProjects' or 'searchUserProjects') to see its associated tasks. This function provides task IDs which can then be used with 'getTaskDetails'. Do NOT ask the user for a project ID directly.",
                parameters: {
                    type: "object",
                    properties: {
                        projectId: {
                            type: "string",
                            description: "The ID of the project to retrieve tasks for."
                        }
                    },
                    required: ["projectId"]
                }
            },
            {
                name: "getTaskDetails",
                description: "Get detailed information about a specific task by its ID. Use this after identifying a task (from 'listProjectTasks') to get its full details, including assigned and created by users. This function provides user IDs which can then be used with 'getUserPortfolio'. Do NOT ask the user for a task ID directly.",
                parameters: {
                    type: "object",
                    properties: {
                        taskId: {
                            type: "string",
                            description: "The ID of the task to retrieve details for."
                        }
                    },
                    required: ["taskId"]
                }
            },
            {
                name: "getUserPortfolio",
                description: "Get portfolio details (skills and links) for a specific user ID. Use this after identifying a contributor from task details ('getTaskDetails') to see their portfolio information. Do NOT ask the user for a user ID directly.",
                parameters: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            description: "The ID of the user whose portfolio to retrieve."
                        }
                    },
                    required: ["userId"]
                }
            },
            {
                name: "createProject",
                description: "Create a new project for the logged-in creator. This function should be called when the user explicitly asks to create a project, providing a title and description. If the user provides an unstructured idea, first structure and improve it, then ask the user for confirmation before calling this function.",
                parameters: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "The title of the new project."
                        },
                        description: {
                            type: "string",
                            description: "A detailed description of the new project."
                        }
                    },
                    required: ["title", "description"]
                }
            }
        ]
    }
];

// Implement the functions that the tools will call
const toolFunctions = {
    createProject: async (title, description, creatorId) => {
        console.log(`Calling createProject with input: title=${title}, description=${description}, creatorId=${creatorId}`);
        try {
            const newProject = new Project({
                title,
                description,
                creator: creatorId,
                status: 'Planning' // Default status for new projects
            });
            await newProject.save();
            console.log(`createProject output: Project created successfully with ID=${newProject._id}`);
            return { message: "Project created successfully!", projectId: newProject._id, title: newProject.title };
        } catch (error) {
            console.error("Error in createProject:", error);
            return { error: "Failed to create project." };
        }
    },
    getProjectDetails: async (projectId) => {
        console.log(`Calling getProjectDetails with input: projectId=${projectId}`);
        try {
            const project = await Project.findById(projectId);
            if (!project) {
                console.log(`getProjectDetails output: Project not found for projectId=${projectId}`);
                return { error: "Project not found." };
            }
            const result = {
                title: project.title,
                description: project.description,
                status: project.status,
                // Add other relevant project details
            };
            console.log(`getProjectDetails output:`, result);
            return result;
        } catch (error) {
            console.error("Error in getProjectDetails:", error);
            return { error: "Failed to retrieve project details." };
        }
    },
    listUserProjects: async (creatorId) => { // creatorId will be injected by chatWithGemini
        console.log(`Calling listUserProjects with input: creatorId=${creatorId}`);
        try {
            const projects = await Project.find({ creator: creatorId }).select('title description');
            if (!projects || projects.length === 0) {
                console.log(`listUserProjects output: No projects found for creatorId=${creatorId}`);
                return { message: "No projects found for this user." };
            }
            const result = projects.map(project => ({
                id: project._id,
                title: project.title,
                description: project.description
            }));
            console.log(`listUserProjects output:`, result);
            return result;
        } catch (error) {
            console.error("Error in listUserProjects:", error);
            return { error: "Failed to retrieve user projects." };
        }
    },
    searchUserProjects: async (creatorId, searchText) => { // creatorId will be injected by chatWithGemini
        console.log(`Calling searchUserProjects with input: creatorId=${creatorId}, searchText=${searchText}`);
        try {
            const regex = new RegExp(searchText, 'i'); // Case-insensitive search
            const projects = await Project.find({
                creator: creatorId,
                $or: [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } }
                ]
            }).select('title description status');

            if (!projects || projects.length === 0) {
                console.log(`searchUserProjects output: No projects found matching search criteria for creatorId=${creatorId}, searchText=${searchText}`);
                return { message: "No projects found matching your search criteria for this user." };
            }
            const result = projects.map(project => ({
                id: project._id,
                title: project.title,
                description: project.description,
                status: project.status
            }));
            console.log(`searchUserProjects output:`, result);
            return result;
        } catch (error) {
            console.error("Error in searchUserProjects:", error);
            return { error: "Failed to search user projects." };
        }
    },
    listProjectTasks: async (projectId) => {
        console.log(`Calling listProjectTasks with input: projectId=${projectId}`);
        try {
            const tasks = await Task.find({ project: projectId }).select('title description status assignedTo createdBy');
            if (!tasks || tasks.length === 0) {
                console.log(`listProjectTasks output: No tasks found for projectId=${projectId}`);
                return { message: "No tasks found for this project." };
            }
            const result = tasks.map(task => ({
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                assignedTo: task.assignedTo,
                createdBy: task.createdBy
            }));
            console.log(`listProjectTasks output:`, result);
            return result;
        } catch (error) {
            console.error("Error in listProjectTasks:", error);
            return { error: "Failed to retrieve project tasks." };
        }
    },
    getTaskDetails: async (taskId) => {
        console.log(`Calling getTaskDetails with input: taskId=${taskId}`);
        try {
            const task = await Task.findById(taskId)
                .populate('assignedTo', 'name email role')
                .populate('createdBy', 'name email role');
            if (!task) {
                console.log(`getTaskDetails output: Task not found for taskId=${taskId}`);
                return { error: "Task not found." };
            }
            const result = {
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                assignedTo: task.assignedTo ? { id: task.assignedTo._id, name: task.assignedTo.name, email: task.assignedTo.email, role: task.assignedTo.role } : null,
                createdBy: task.createdBy ? { id: task.createdBy._id, name: task.createdBy.name, email: task.createdBy.email, role: task.createdBy.role } : null,
            };
            console.log(`getTaskDetails output:`, result);
            return result;
        } catch (error) {
            console.error("Error in getTaskDetails:", error);
            return { error: "Failed to retrieve task details." };
        }
    },
    getUserPortfolio: async (userId) => {
        console.log(`Calling getUserPortfolio with input: userId=${userId}`);
        try {
            const user = await User.findById(userId).select('name email role skills portfolioLinks');
            if (!user) {
                console.log(`getUserPortfolio output: User not found for userId=${userId}`);
                return { error: "User not found." };
            }
            const result = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                skills: user.skills,
                portfolioLinks: user.portfolioLinks
            };
            console.log(`getUserPortfolio output:`, result);
            return result;
        } catch (error) {
            console.error("Error in getUserPortfolio:", error);
            return { error: "Failed to retrieve user portfolio." };
        }
    }
};

const generateTaskContent = async (prompt, projectDetails) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });

        const projectContext = projectDetails ? `The task is for a project titled "${projectDetails.title}" with the following description: "${projectDetails.description}". The project's current status is "${projectDetails.status}".` : '';

        const systemInstruction = `You are a helpful assistant that generates task details for a project management system. Based on the user's input and the provided project context, generate a concise task title and a detailed description.

        The output MUST be a JSON object adhering to the following schema:
        {
            "title": "string", // Required: A concise title for the task.
            "description": "string" // Required: A detailed description of the task.
        }

        Ensure the title and description are always present.
        ${projectContext}
        `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }],
                },
                {
                    role: "model",
                    parts: [{ text: "Okay, I understand. I will generate task titles and descriptions in JSON format based on your instructions and the provided project context." }],
                },
            ],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
                topP: 0.95,
                topK: 64,
            },
        });

        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const text = response.text();

        let parsedContent;
        try {
            parsedContent = JSON.parse(text);
        } catch (jsonError) {
            console.error("Failed to parse Gemini response as JSON:", jsonError);
            console.error("Raw Gemini response:", text);
            throw new Error(`AI generation failed: Invalid JSON response. Raw: ${text}`);
        }

        // Basic validation for required fields
        if (!parsedContent.title || !parsedContent.description) {
            throw new Error("AI generation failed: Missing required 'title' or 'description' in response.");
        }

        return {
            title: parsedContent.title,
            description: parsedContent.description,
        };

    } catch (error) {
        console.error('Error generating task content with Gemini API:', error);
        throw new Error(`Failed to generate task content with AI: ${error.message}`);
    }
};

const chatWithGemini = async (prompt, history = [], creatorId) => {
    try {
        let systemInstruction = `You are a helpful project management assistant. Your name is ProjectShare AI.
        When the user asks about their projects, use the 'listUserProjects' tool to show them all available projects.
        Once a project is identified (either by listing or searching), you can use its 'id' with 'getProjectDetails' to retrieve more information. Use it to search or find anything in the project details as well.
        To see tasks for a project, use 'listProjectTasks' with the project's ID.
        To get details about a specific task, use 'getTaskDetails' with the task's ID.
        To get portfolio details of a contributor, use 'getUserPortfolio' with the user's ID obtained from task details.
        If the user provides an unstructured idea for a project, you should first structure and improve the idea. Then, present the refined project idea (title and description) back to the user and ask for their confirmation before calling the 'createProject' tool. Once confirmed, use the 'createProject' tool with the refined title and description.
        Crucially, you must NEVER ask the user for any IDs (project, task, or user). Always use the 'listUserProjects' or 'searchUserProjects' tools to find project IDs, 'listProjectTasks' to find task IDs, and 'getTaskDetails' to find user IDs, based on the user's natural language input.
        Feel free to make multiple function calls as needed to gather enough information to fulfill the user's request.
        Since our tools need IDs, send any IDs you get from the APIs as part of your chat message so that you can read them when you want to do any queries with them at any point. When summarizing tool results, explicitly mention any relevant IDs (e.g., project IDs, task IDs, user IDs) so they become part of the conversational history.
        If the user asks about something vaguely,try to find the closest thing to it. It could be a missspelling on the user's part while creating projects/issues/accounts or missspelling during chat. try listing out all projects, finding tasks for them, etc., to find something similar as much as possible. Only then can you tell the user that you weren't able to fulfill the request. for example, if the user asks for a project with the name project manager, use the function to find projects that are similar to the name if not available, like a project named prjshare would qualify. 
        Always remember that the user usually will not tell you anything exactly. Like project names, descriptions, etc. so you should always be prepared to handle that by using the search api or the listing api to find the closest thing to what they are looking for.
        Note that you are also an AI assistant, so help the user through other things like decision making tasks, planning tasks etcif the user requires you to do so.
        Always provide a clear, concise, and conversational response to the user, summarizing the information found or stating clearly if no relevant information was found. Avoid blank responses.
        If a task requires multiple function calls or steps, inform the user that you will need them to send multiple messages, one for each step.
        For multi-step tasks, ensure you send all necessary context for the next step as part of your response to the user.
        After executing any tool, you MUST provide a conversational summary of the results. If a tool returns no data (e.g., no projects found), clearly state that no relevant information was found for the user's query. Do NOT return empty responses or generic "I have processed your request" messages. Always aim to be helpful and informative.`;

        // Dynamically add creatorId to the system instruction for context
        if (creatorId) {
            systemInstruction += ` The current logged-in user's ID is: ${creatorId}. Use this ID for any operations that require the creator's context, such as creating projects or listing user-specific data.`;
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Use a conversational model
            tools: tools,
            toolConfig: {
                functionCallingConfig: {
                    mode: "AUTO", // AUTO, ANY, NONE
                },
            },
            systemInstruction: systemInstruction, // Use the dynamically enhanced systemInstruction
        });

        const chat = model.startChat({
            history: [{
                role: "user",
                parts: [{ text: "Hello!" }],
            },
            {
                role: "model",
                parts: [{ text: "Hello, I'm ProjectShare AI! I'm here to help you manage your projects and tasks. How can I assist you today?" }],
            },
            ...history // Include existing history
            ],
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 64,
                responseMimeType: "text/plain", // Chatbot will respond in plain text
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
        });

        const result = await chat.sendMessage(prompt);
        const response = result.response;

        // Handle function calls
        const functionCalls = response.functionCalls();
        if (functionCalls && functionCalls.length > 0) {
            const toolResponses = [];
            for (const call of functionCalls) {
                const { name, args } = call;
                const func = toolFunctions[name];
                if (func) {
                    let toolResult;
                    // Inject creatorId into args if the function expects it
                    if (name === "listUserProjects" || name === "searchUserProjects") {
                        toolResult = await func(creatorId, args.searchText); // Pass creatorId and searchText
                    } else if (name === "createProject") {
                        toolResult = await func(args.title, args.description, creatorId); // Pass title, description, and creatorId
                    } else if (name === "listProjectTasks") {
                        toolResult = await func(args.projectId);
                    } else if (name === "getTaskDetails") {
                        toolResult = await func(args.taskId);
                    } else if (name === "getUserPortfolio") {
                        toolResult = await func(args.userId);
                    }
                    else {
                        toolResult = await func(...Object.values(args));
                    }
                    toolResponses.push({
                        functionResponse: {
                            name: name,
                            response: { [name]: toolResult }, // Corrected structure
                        },
                    });
                } else {
                    toolResponses.push({
                        functionResponse: {
                            name: name,
                            response: { error: "Function not found." }, // Corrected structure
                        },
                    });
                }
            }
            const toolResponse = await chat.sendMessage(toolResponses);
            const toolResponseText = toolResponse.response.text();
            console.log(`Tool response text: ${toolResponseText}`);
            
            if (!toolResponseText || toolResponseText.trim() === "") {
                console.log(`No tool response text found. Returning a generic response.`+toolResponseText, toolResponse);
                return "I've processed your request. If you'd like to know more about the results or have another question, please let me know!";
            }
            return toolResponseText;
        }

        const finalResponseText = response.text();
        if (!finalResponseText || finalResponseText.trim() === "") {
            return "I couldn't find specific information for that. Could you please rephrase your request or ask something else?";
        }
        return finalResponseText;

    } catch (error) {
        console.error('Error chatting with Gemini API:', error);
        throw new Error(`Failed to chat with AI: ${error.message}`);
    }
};

export {
    generateTaskContent,
    chatWithGemini
};
