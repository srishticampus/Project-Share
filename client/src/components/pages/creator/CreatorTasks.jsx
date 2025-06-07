import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Task from '@/components/Task';
import { getTasksByProject, createTask } from '@/services/taskService';
import { getProjects } from '@/components/pages/creator/projectService';
import { fetchUserProfile } from '@/services/userService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import apiClient from '@/lib/apiClient';

function CreatorTasks() {
    const [tasks, setTasks] = useState([]);
    const [projectId, setProjectId] = useState('');
    const [projects, setProjects] = useState([]);
    const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
    const [newTaskData, setNewTaskData] = useState({ title: '', description: '', assignedTo: '', status: 'Open', priority: 'Medium', dueDate: '' });
    const [collaborators, setCollaborators] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
    const [editTaskData, setEditTaskData] = useState({ title: '', description: '', assignedTo: '', status: 'Open', priority: 'Medium', dueDate: '' });
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        // Fetch projects on component mount
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        const fetchProfile = async () => {
            try {
                const profile = await fetchUserProfile();
                setUserProfile(profile);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchProjects();
        fetchProfile();
    }, []);

    useEffect(() => {
        // Fetch tasks for the selected project
        const fetchTasks = async () => {
            if (projectId) {
                try {
                    const data = await getTasksByProject(projectId);
                    setTasks(data.tasks);
                    setCollaborators(data.collaborators || []); // Corrected: Access collaborators directly from data
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                }
            }
        };

        fetchTasks();
    }, [projectId]);

    const handleProjectSelect = (value) => {
        setProjectId(value);
    };

    const handleTaskInputChange = (e) => {
        const { name, value } = e.target;
        setNewTaskData({ ...newTaskData, [name]: value });
    };

    const handleCreateTask = async () => {
        // Basic validation
        if (!newTaskData.title || !newTaskData.description) {
            alert('Title and Description are required.');
            return;
        }

        try {
            const data = await createTask({ ...newTaskData, project: projectId });
            setTasks([...tasks, data.task]);
            setNewTaskData({ title: '', description: '', status: 'Open', priority: 'Medium', dueDate: '' });
            setIsCreateTaskDialogOpen(false);
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await apiClient.delete(`/creator/tasks/${taskId}`);
            // After successful deletion, re-fetch tasks
            const data = await getTasksByProject(projectId);
            setTasks(data.tasks);
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        }
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setEditTaskData(task);
        setIsEditTaskDialogOpen(true);
    };

    const handleEditTaskInputChange = (e) => {
        const { name, value } = e.target;
        setEditTaskData({ ...editTaskData, [name]: value });
    };

    const handleSaveEditTask = async () => {
        try {
            await apiClient.put(`/creator/tasks/${selectedTask._id}`, editTaskData);

            // Find the full collaborator object from the collaborators list
            const assignedCollaborator = collaborators.find(
                (col) => col._id === editTaskData.assignedTo
            );

            // Create an updated task object, ensuring assignedTo is the full object
            const updatedTask = {
                ...selectedTask, // Keep existing properties of the selected task
                ...editTaskData, // Apply edited data
                assignedTo: assignedCollaborator || null, // Use the full object or null if unassigned
            };

            // Update the tasks state with the edited task
            setTasks(tasks.map((task) => (task._id === selectedTask._id ? updatedTask : task)));
            setIsEditTaskDialogOpen(false);
        } catch (error) {
            console.error('Error editing task:', error);
            alert('Failed to edit task.');
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle>Tasks</CardTitle>
                    <CardDescription>Manage tasks for the selected project.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Label htmlFor="projectSelect" className="mr-2">Select Project:</Label>
                        <Select onValueChange={handleProjectSelect}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                        {project.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Task tasks={tasks} onDeleteTask={handleDeleteTask} onEditTask={handleEditTask} />
                </CardContent>
                <Dialog open={isCreateTaskDialogOpen} onOpenChange={setIsCreateTaskDialogOpen}>
                    <DialogTrigger asChild>
                        {projectId ? (
                            <Button size="sm" className="gap-1 mx-8">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                >
                                    <path d="M5 12h14M12 5v14" />
                                </svg>
                                Create Task
                            </Button>
                        ) : (
                            <Button size="sm" variant="disabled" disabled={!projectId} className="mx-8">Please select a project to create tasks.</Button>
                        )}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                            <DialogDescription>
                                Fill in the details for your new task. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Title
                                </Label>
                                <Input id="title" name="title" value={newTaskData.title} onChange={handleTaskInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Textarea id="description" name="description" value={newTaskData.description} onChange={handleTaskInputChange} className="col-span-3" placeholder="Describe your task..." />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="assignedTo" className="text-right">
                                    Assigned To
                                </Label>
                                <Select onValueChange={(value) => handleTaskInputChange({ target: { name: 'assignedTo', value } })} className="col-span-3">
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userProfile && (
                                            <SelectItem key={userProfile.id} value={userProfile.id}>
                                                {userProfile.name} (You)
                                            </SelectItem>
                                        )}
                                        {collaborators
                                            .filter(collaborator => collaborator) // Filter out null/undefined collaborators
                                            .map((collaborator) => (
                                                <SelectItem key={collaborator._id} value={collaborator._id}>
                                                    {collaborator.name || collaborator._id} {/* Use 'name' or fallback to ID */}
                                            </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    Status
                                </Label>
                                <select id="status" name="status" value={newTaskData.status} onChange={handleTaskInputChange} className="col-span-3 border rounded p-2">
                                    <option value="Open">Open</option>
                                    <option value="InProgress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Blocked">Blocked</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="priority" className="text-right">
                                    Priority
                                </Label>
                                <select id="priority" name="priority" value={newTaskData.priority} onChange={handleTaskInputChange} className="col-span-3 border rounded p-2">
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dueDate" className="text-right">
                                    Due Date
                                </Label>
                                <Input type="date" id="dueDate" name="dueDate" value={newTaskData.dueDate} onChange={handleTaskInputChange} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="button" onClick={handleCreateTask}>Save Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                            <DialogDescription>
                                Edit the details for your task. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Title
                                </Label>
                                <Input id="title" name="title" value={editTaskData.title} onChange={handleEditTaskInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Textarea id="description" name="description" value={editTaskData.description} onChange={handleEditTaskInputChange} className="col-span-3" placeholder="Describe your task..." />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="assignedTo" className="text-right">
                                    Assigned To
                                </Label>
                                <Select onValueChange={(value) => handleEditTaskInputChange({ target: { name: 'assignedTo', value } })} className="col-span-3">
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userProfile && (
                                            <SelectItem key={userProfile.id} value={userProfile.id}>
                                                {userProfile.name} (You)
                                            </SelectItem>
                                        )}
                                        {collaborators
                                            .filter(collaborator => collaborator) // Filter out null/undefined collaborators
                                            .map((collaborator) => (
                                                <SelectItem key={collaborator._id} value={collaborator._id}>
                                                    {collaborator.name || collaborator._id} {/* Use 'name' or fallback to ID */}
                                            </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    Status
                                </Label>
                                <select id="status" name="status" value={editTaskData.status} onChange={handleEditTaskInputChange} className="col-span-3 border rounded p-2">
                                    <option value="Open">Open</option>
                                    <option value="InProgress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Blocked">Blocked</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="priority" className="text-right">
                                    Priority
                                </Label>
                                <select id="priority" name="priority" value={editTaskData.priority} onChange={handleEditTaskInputChange} className="col-span-3 border rounded p-2">
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dueDate" className="text-right">
                                    Due Date
                                </Label>
                                <Input type="date" id="dueDate" name="dueDate" value={editTaskData.dueDate} onChange={handleEditTaskInputChange} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="button" onClick={handleSaveEditTask}>Save Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Card>
        </div>
    );
}

export default CreatorTasks;
