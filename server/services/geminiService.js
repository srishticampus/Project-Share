import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


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

export {
    generateTaskContent
};
