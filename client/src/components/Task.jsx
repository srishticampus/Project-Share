import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import apiClient from '@/lib/apiClient';
import { Edit, Trash2 } from 'lucide-react';

const Task = ({ tasks, onEditTask,onDeleteTask }) => {
    const handleEditTask = (task) => {
        // Implement edit logic here
        console.log(`Edit task with ID: ${task._id}`);
        onEditTask(task);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            // await apiClient.delete(`/creator/tasks/${taskId}`);
            // Update the tasks state in the parent component
            // tasks = tasks.filter((task) => task._id !== taskId); // This line won't work, need to update state in parent
            // on delete refresh the tasks
            onDeleteTask(taskId);
            console.log(`Task with ID: ${taskId} deleted successfully`);
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        }
    };

    return (
        <Table>
            <TableCaption>Tasks</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map((task) => (
                    <TableRow key={task._id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.description}</TableCell>
                        <TableCell>{task.assignedTo ? `${task.assignedTo.name}` : 'Unassigned'}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{task.priority}</TableCell>
                        <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</TableCell>
                        <TableCell>
                            <Button size="sm" onClick={() => handleEditTask(task)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteTask(task._id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default Task;