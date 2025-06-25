import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient'; // Assuming an API client

function AppliedProjects() {
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for now
  const dummyAppliedProjects = [
    {
      _id: 'app1',
      projectTitle: 'Build a Personal Website',
      status: 'Pending',
      applicationDate: '2023-10-26',
    },
    {
      _id: 'app2',
      projectTitle: 'Mobile App for Task Management',
      status: 'Accepted',
      applicationDate: '2023-10-20',
    },
    {
      _id: 'app3',
      projectTitle: 'Data Analysis for Research Project',
      status: 'Rejected',
      applicationDate: '2023-10-15',
    },
  ];

  useEffect(() => {
    const fetchAppliedProjects = async () => {
      try {
        const response = await apiClient.get('/collaborator/my-projects/applied');
        setAppliedProjects(response.data);
      } catch (error) {
        console.error('Error fetching applied projects:', error);
        setError('Failed to fetch applied projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedProjects();

  }, []);

  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <h1 className="text-2xl font-semibold mb-4">Applied Projects</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-1/3 mb-1" />
                  <Skeleton className="h-4 w-2/3" />
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
        <h1 className="text-2xl font-semibold mb-4">Applied Projects</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appliedProjects.map((application) => (
            <Card key={application._id}>
              <CardHeader>
                <CardTitle>{application.projectTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Creator:</strong> {application?.creator?.name}</p>
                <p><strong>Status:</strong> {application.status}</p>
                <p><strong>Application Date:</strong> {new Date(application.applicationDate).toLocaleString()}</p>
                {application.project?.description && (
                  <p className="text-sm text-gray-600 mt-2">{application.project.description}</p>
                )}
                {/* TODO: Add a link to view project details if needed */}
                {/* <Link to={`/collaborator/projects/${application.projectId}`}>View Project Details</Link> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default AppliedProjects;
