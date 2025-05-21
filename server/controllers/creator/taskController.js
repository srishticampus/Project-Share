import Task from '../../models/Task.js';
import Project from '../../models/Project.js';
import mongoose from 'mongoose';
import User from '../../models/user.js';
// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, project, assignedTo, status, priority, dueDate } = req.body;
        const userId = req.user.id;

        // Check if the project exists and the user is a creator or collaborator on the project
        if (!mongoose.Types.ObjectId.isValid(project)) {
            return res.status(400).json({ message: 'Invalid Project ID' });
        }

        const projectExists = await Project.exists({ _id: project, $or: [{ creator: userId }, { collaborators: userId }] });
        if (!projectExists) {
            return res.status(400).json({ message: 'Project not found or you are not authorized to add tasks to this project' });
        }

        let assignedToValue = assignedTo;
        if (assignedTo === "") {
            assignedToValue = null;
        } else if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
            return res.status(400).json({ message: 'Invalid User ID for assignedTo' });
        }

        const task = new Task({
            title,
            description,
            project,
            assignedTo: assignedToValue,
            createdBy: userId,
            status,
            priority,
            dueDate
        });

        await task.save();

        // Increment taskInteractionCount for the creator
        await User.findByIdAndUpdate(userId, { $inc: { taskInteractionCount: 1 } });

        const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name'); // Populate assignedTo
        res.status(201).json({ message: 'Task created successfully', task: populatedTask }); // Return populated task
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create task', error: error.message });
    }
};

// Assign a task to a user
export const assignTask = async (req, res) => {
    try {
        const { taskId, assignedTo } = req.body;
        const userId = req.user.id;

        // Check if the task exists and the user is the creator of the project
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);
        if (!project || project.creator.toString() !== userId) {
            return res.status(400).json({ message: 'You are not authorized to assign this task' });
        }

        task.assignedTo = assignedTo;
        await task.save();
        res.status(200).json({ message: 'Task assigned successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to assign task', error: error.message });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, assignedTo, status, priority, dueDate } = req.body;
        const userId = req.user.id;

        // Check if the task exists and the user is the creator of the project or the assigned user
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);
        if (!project || (project.creator.toString() !== userId && task.assignedTo.toString() !== userId)) {
            return res.status(400).json({ message: 'You are not authorized to update this task' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo || task.assignedTo;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;

        await task.save();

        // Increment taskInteractionCount for the user who updated the task (creator or assignedTo)
        await User.findByIdAndUpdate(userId, { $inc: { taskInteractionCount: 1 } });

        const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name'); // Populate assignedTo
        res.status(200).json({ message: 'Task updated successfully', task: populatedTask }); // Return populated task
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
};

// Get tasks by project ID
export const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        // Check if the project exists and the user is a creator or collaborator on the project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(400).json({ message: 'Project not found or you are not authorized to view tasks for this project' });
        }

        const isCollaborator = project.collaborators.includes(userId);
        const isCreator = project.creator.toString() === userId;

        if (!isCollaborator && !isCreator) {
            return res.status(400).json({ message: 'Project not found or you are not authorized to view tasks for this project' });
        }

        let collaborators = project.collaborators;
        if (collaborators.length === 0 && isCreator) {
            collaborators = [userId];
        }

        console.log('Initial collaborators (IDs):', collaborators); // Log initial IDs

        const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name'); // Changed to populate 'name'
        
        // Populate collaborators with user data
        const populatedCollaborators = await Promise.all(
            collaborators.map(async (collaboratorId) => {
                try {
                    const user = await User.findById(collaboratorId, 'name'); // Changed to select 'name'
                    console.log('Fetched user for collaborator ID', collaboratorId, ':', user); // Log fetched user
                    return user;
                } catch (error) {
                    console.error('Error fetching collaborator:', error);
                    return null; // Or some other placeholder
                }
            })
        );

        console.log('Populated collaborators:', populatedCollaborators); // Log populated collaborators

        res.status(200).json({ tasks, collaborators: populatedCollaborators });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get tasks', error: error.message });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        // Check if the task exists and the user is the creator of the project
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);
        if (!project || project.creator.toString() !== userId) {
            return res.status(400).json({ message: 'You are not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(taskId);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }
};

// Edit a task
export const editTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, assignedTo, status, priority, dueDate } = req.body;
        const userId = req.user.id;

        // Check if the task exists and the user is the creator of the project or the assigned user
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);
        if (!project || (project.creator.toString() !== userId && task.assignedTo.toString() !== userId)) {
            return res.status(400).json({ message: 'You are not authorized to update this task' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo || task.assignedTo;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;

        await task.save();
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
};