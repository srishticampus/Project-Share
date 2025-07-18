import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router'; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient'; // Assuming an API client

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]); // New state for tasks
  const [applicationMessage, setApplicationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [canApply, setCanApply] = useState(true); // State to control form visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project details and tasks
        const projectResponse = await apiClient.get(`/projects/${projectId}`);
        const { project, tasks } = projectResponse.data; // Destructure project and tasks
        setProject(project);
        setTasks(tasks); // Set tasks state

        // Fetch current user details
        const userResponse = await apiClient.get('/auth/users/me');
        const user = userResponse.data;
        setCurrentUser(user);

        // Check if the user has already applied, is a collaborator, or has completed the project
        if (user) {
          const appliedProjectsResponse = await apiClient.get('/collaborator/my-projects/applied');
          const activeProjectsResponse = await apiClient.get('/collaborator/my-projects/active');
          const completedProjectsResponse = await apiClient.get('/collaborator/my-projects/completed');

          const hasApplied = appliedProjectsResponse.data.some(app => app._id === projectId);
          const isActiveCollaborator = activeProjectsResponse.data.some(proj => proj._id === projectId);
          const hasCompletedProject = completedProjectsResponse.data.some(proj => proj._id === projectId);

          if (hasApplied || isActiveCollaborator || hasCompletedProject) {
            setCanApply(false);
          } else {
            setCanApply(true);
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch project details, user data, or application/project status.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, [projectId]); // Depend on projectId

  const handleApply = async () => {
    try {
      if (!currentUser) {
        setError('User not loaded. Cannot submit application.');
        return;
      }

      if (!applicationMessage.trim()) { // Check if message is empty or only whitespace
        alert('Application message is required.');
        return;
      }

      const applicantId = currentUser._id;

      await apiClient.post('/applications', {
        projectId: projectId,
        applicantId: applicantId,
        message: applicationMessage,
      });
      alert('Application submitted successfully!'); // Show success message
      setCanApply(false); // Hide form after successful submission
      // TODO: Redirect to applied projects page or update UI
    } catch (error) {
      console.error('Error submitting application:', error);
      // The backend already checks if the user has applied and returns a 400.
      // We rely on the initial load check to hide the form if already applied.
      // If they somehow get here after applying, the backend will prevent a duplicate.
      setError('Failed to submit application.'); // Show generic error message
    }
  };

  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <h1 className="text-2xl font-semibold mb-4">Project Details: <Skeleton className="h-6 w-1/2 inline-block" /></h1>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-2/3 mb-1" />
              <Skeleton className="h-20 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-1" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <Skeleton className="h-4 w-1/4 mb-1" />
              <Skeleton className="h-4 w-1/4 mb-1" />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Skeleton className="h-5 w-1/2 mb-1" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Project Details: {project.title}</h1>

        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Creator:</strong>{' '}
              {project.creator ? (
                <Link to={`/creator/profile/${project.creator._id}`} className="text-blue-600 hover:underline">
                  {project.creator.name}
                </Link>
              ) : (
                'N/A'
              )}
            </p>
            <p><strong>Category:</strong> {project.category}</p>
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Tech Stack:</strong> {project?.techStack?.join(', ')}</p>
            {project.attachments && project.attachments.length > 0 && (
              <div>
                <p><strong>Attachments:</strong></p>
                <ul>
                  {project.attachments.map((attachment, index) => (
                    <li key={index}>{attachment}</li> 
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Project Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <Card key={task._id} className="p-4">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-sm mt-2">
                      <strong>Status:</strong> {task.status}
                    </p>
                    {task.assignedTo && (
                      <p className="text-sm">
                        <strong>Assigned To:</strong> {task.assignedTo.name}
                      </p>
                    )}
                    <p className="text-sm">
                      <strong>Created By:</strong> {task.createdBy.name}
                    </p>
                    {task.dueDate && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                  </Card>
                ))}
              </div>
            ) : (
              <p>No tasks found for this project.</p>
            )}
          </CardContent>
        </Card>

        {canApply && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Apply to this Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="applicationMessage">Your Application Message</Label>
                  <Textarea
                    id="applicationMessage"
                    placeholder="Tell the creator why you're a good fit..."
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                  />
                </div>
                <Button onClick={handleApply}>Submit Application</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

export default ProjectDetails;
