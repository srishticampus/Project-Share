import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import apiClient from '@/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function MentorProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]); // Add tasks state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await apiClient.get(`/projects/${projectId}`);
        setProject(response.data.project);
        setTasks(response.data.tasks); // Set tasks
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return <div className="text-center py-8">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!project) {
    return <div className="text-center py-8 text-gray-500">Project not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{project.title}</CardTitle>
          <p className="text-sm text-gray-600">Creator: {project.creator ? project.creator.name : 'Unknown'}</p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{project.description}</p>
          <div className="mb-4">
            <h3 className="font-semibold">Status:</h3>
            <Badge variant="secondary">{project.status}</Badge>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Tech Stack:</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack && Array.isArray(project.techStack) ? (
                project.techStack.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">None specified.</p>
              )}
            </div>
          </div>
          {tasks && tasks.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold">Tasks:</h3>
              <ul className="list-disc pl-5">
                {tasks.map((task) => (
                  <li key={task._id}>
                    <strong>{task.title}</strong>: {task.description} (Status: {task.status})
                    {task.assignedTo && <p className="text-sm text-gray-500 ml-4">Assigned To: {task.assignedTo.name} ({task.assignedTo.email})</p>}
                    {task.createdBy && <p className="text-sm text-gray-500 ml-4">Created By: {task.createdBy.name} ({task.createdBy.email})</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Add more project details here as needed */}
          <div className="mt-6">
            <Button onClick={() => navigate(`/mentor/chat/${project.creator._id}`)}>
              Chat with Creator
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MentorProjectDetails;
