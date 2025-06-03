import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch"; // Assuming a switch component for toggle
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient'; // Assuming an API client

function CompletedProjects() {
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for now
  const dummyCompletedProjects = [
    {
      _id: 'comp1',
      title: 'Build a Personal Website',
      creator: 'John Doe',
      completionDate: '2023-11-15',
      myContributions: 'Developed the frontend using React and integrated with a headless CMS.',
      addToPortfolio: true,
    },
    {
      _id: 'comp2',
      title: 'E-commerce Platform Development',
      creator: 'Alice Brown',
      completionDate: '2023-09-30',
      myContributions: 'Contributed to the backend API development and database design.',
      addToPortfolio: false,
    },
  ];

  useEffect(() => {
    const fetchCompletedProjects = async () => {
      try {
        const response = await apiClient.get('/collaborator/my-projects/completed');
        setCompletedProjects(response.data);
      } catch (error) {
        console.error('Error fetching completed projects:', error);
        setError('Failed to fetch completed projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedProjects();

  }, []);

  const handleContributionChange = async (projectId, newContribution) => {
    // Update the local state with the new contribution immediately for better UX
    setCompletedProjects(completedProjects.map(project =>
      project._id === projectId ? { ...project, myContributions: newContribution } : project
    ));
    try {
      // TODO: Implement the correct backend endpoint for updating contributions
      await apiClient.put(`/collaborator/my-projects/completed/${projectId}`, { myContributions: newContribution });
      console.log(`Contribution for project ${projectId} updated successfully.`);
    } catch (error) {
      console.error('Error updating contribution:', error);
      setError('Failed to update contribution.');
      // TODO: Revert local state change if API call fails
    }
  };

  const handleAddToPortfolioToggle = async (projectId, isChecked) => {
    // Update the local state with the new toggle value immediately for better UX
    setCompletedProjects(completedProjects.map(project =>
      project._id === projectId ? { ...project, addToPortfolio: isChecked } : project
    ));
    try {
      // TODO: Implement the correct backend endpoint for updating portfolio toggle
      await apiClient.put(`/collaborator/my-projects/completed/${projectId}`, { addToPortfolio: isChecked });
      console.log(`Add to portfolio toggled for project ${projectId}: ${isChecked}`);
    } catch (error) {
      console.error('Error toggling add to portfolio:', error);
      setError('Failed to toggle add to portfolio.');
      // TODO: Revert local state change if API call fails
    }
  };


  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <h1 className="text-2xl font-semibold mb-4">Completed Projects</h1>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {[...Array(2)].map((_, index) => ( // Render 2 skeleton cards for projects
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-5 w-2/5 mb-3" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Completed Projects</h1>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {completedProjects.map((project) => (
            <Card key={project._id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <p className="text-sm text-gray-500">Creator: {project.creator?.name}</p>
                <p className="text-sm text-gray-500">Category: {project.category}</p>
                <p className="text-sm text-gray-500">Completion Date: {project.completionDate}</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Label htmlFor={`contributions-${project._id}`}>My Contributions:</Label>
                  <Textarea
                    id={`contributions-${project._id}`}
                    placeholder="Describe your contributions to this project..."
                    value={project.myContributions}
                    onChange={(e) => handleContributionChange(project._id, e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Label htmlFor={`portfolio-toggle-${project._id}`}>Add to Portfolio:</Label>
                  <Switch
                    id={`portfolio-toggle-${project._id}`}
                    checked={project.addToPortfolio}
                    onCheckedChange={(isChecked) => handleAddToPortfolioToggle(project._id, isChecked)}
                  />
                </div>
                {/* TODO: Add a link to view project details if needed */}
                {/* <Link to={`/collaborator/projects/${project._id}`}>View Project Details</Link> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default CompletedProjects;
