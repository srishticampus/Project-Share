import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming a select component for task status
import apiClient from '@/lib/apiClient'; // Assuming an API client

function ActiveProjects() {
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for now
  const dummyActiveProjects = [
    {
      _id: 'proj1',
      title: 'Mobile App for Task Management',
      creator: 'Jane Smith',
      myTasks: [ // Assuming tasks are nested within the project
        { _id: 'task1', title: 'Implement User Authentication', status: 'In Progress' },
        { _id: 'task2', title: 'Design UI/UX', status: 'Completed' },
      ],
    },
    {
      _id: 'proj2',
      title: 'Data Analysis for Research Project',
      creator: 'Peter Jones',
      myTasks: [
        { _id: 'task3', title: 'Clean Dataset', status: 'Completed' },
        { _id: 'task4', title: 'Perform Regression Analysis', status: 'Open' },
      ],
    },
  ];

  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        const response = await apiClient.get('/collaborator/my-projects/active');
        setActiveProjects(response.data);
      } catch (error) {
        console.error('Error fetching active projects:', error);
        setError('Failed to fetch active projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchActiveProjects();

  }, []);

  const handleUpdateTaskStatus = async (projectId, taskId, newStatus) => {
    try {
      await apiClient.put(`/collaborator/projects/${projectId}/tasks/${taskId}`, { status: newStatus });
      // Update the task status in the local state
      setActiveProjects(activeProjects.map(project => {
        if (project._id === projectId) {
          return {
            ...project,
            myTasks: project.myTasks.map(task =>
              task._id === taskId ? { ...task, status: newStatus } : task
            ),
          };
        }
        return project;
      }));
      console.log(`Task ${taskId} status updated successfully.`);
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status.');
    }
  };

  if (loading) {
    return <div>Loading active projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Active Projects</h1>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {activeProjects.map((project) => (
            <Card key={project._id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <p className="text-sm text-gray-500">Creator: {project.creator?.name}</p>
                <p className="text-sm text-gray-500">Category: {project.category}</p>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">My Tasks:</h3>
                {project.myTasks && project.myTasks.length > 0 ? (
                  <ul>
                    {project.myTasks.map((task) => (
                      <li key={task._id} className="mb-2">
                        <p><strong>Task:</strong> {task.title}</p>
                        <div className="flex items-center space-x-2">
                          <span>Status: {task.status}</span>
                          {/* TODO: Implement Select for status update */}
                          <Select onValueChange={(newValue) => handleUpdateTaskStatus(project._id, task._id, newValue)} value={task.status}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Open">Open</SelectItem>
                              <SelectItem value="InProgress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Blocked">Blocked</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tasks assigned yet.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ActiveProjects;