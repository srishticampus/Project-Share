import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from 'react-router';
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient'; // Assuming an API client

function CollaboratorDashboardPage() {
  const [counts, setCounts] = useState({
    appliedProjectsCount: 0,
    activeProjectsCount: 0,
    completedProjectsCount: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]); // New state for recent projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch counts
        const countsRes = await apiClient.get('/collaborator/dashboard/counts');
        setCounts(countsRes.data);

        // Fetch recent projects
        const recentProjectsRes = await apiClient.get('/collaborator/dashboard/recent-projects');
        if (recentProjectsRes.data.success) {
          setRecentProjects(recentProjectsRes.data.data);
        } else {
          throw new Error(recentProjectsRes.data.error || 'Failed to fetch recent projects');
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-2/3 mb-1" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>

          <Card>
            <div className="p-4 flex flex-col space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-56" />
            </div>
          </Card>

          {/* New Card for Recent Projects */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-2/3 mb-1" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error) {
    return <main className="flex-1 px-6 pb-6">Error: {error}</main>;
  }

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Applied Projects: {counts.appliedProjectsCount}</p>
            <p>Active Projects: {counts.activeProjectsCount}</p>
            <p>Completed Projects: {counts.completedProjectsCount}</p>
          </CardContent>
        </Card>

        {/* Add more cards or components for other collaborator dashboard features here */}

        <Card>
            <div className="p-4 flex flex-col space-y-2">
              <Link to="/collaborator/profile" className="text-blue-500 hover:underline">View Profile</Link>
              <Link to="/collaborator/connect-with-mentors" className="text-blue-500 hover:underline">Connect with Mentors</Link>
            </div>
          </Card>

          {/* New Card for Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {recentProjects.length > 0 ? (
                <ul className="space-y-2">
                  {recentProjects.map((project) => (
                    <li key={project._id}>
                      <Link to={`/projects/${project._id}`} className="text-blue-500 hover:underline">
                        {project.title} ({project.status})
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent projects found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

export default CollaboratorDashboardPage;
