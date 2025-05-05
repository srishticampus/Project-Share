import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router'; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/apiClient'; // Assuming an API client

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [canApply, setCanApply] = useState(true); // State to control form visibility

  // Dummy data for now
  const dummyProject = {
    _id: '1',
    title: 'Build a Personal Website',
    creator: 'John Doe',
    category: 'Web Development',
    description: 'Looking for a frontend developer to build a personal portfolio website. This project involves creating a responsive and visually appealing website to showcase my skills and projects. The ideal collaborator will have experience with modern frontend frameworks and a good eye for design.',
    skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Responsive Design'],
    timeline: '2 weeks',
    attachments: ['resume.pdf', 'design_mockups.zip'], // Dummy attachments
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project details
        const projectResponse = await apiClient.get(`/collaborator/projects/${projectId}`);
        setProject(projectResponse.data);

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
    return <div>Loading project details...</div>;
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
            <p><strong>Creator:</strong> {project.creator?.name}</p>
            <p><strong>Category:</strong> {project.category}</p>
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Required Skills:</strong> {project?.skills?.join(', ')}</p>
            <p><strong>Timeline:</strong> {project.timeline}</p>
            {project.attachments && project.attachments.length > 0 && (
              <div>
                <p><strong>Attachments:</strong></p>
                <ul>
                  {project.attachments.map((attachment, index) => (
                    <li key={index}>{attachment}</li> // TODO: Make attachments downloadable links
                  ))}
                </ul>
              </div>
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