import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from '@/lib/apiClient';

function MentorDashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    mentorshipRequests: 0,
    activeMentorships: 0,
    projectsFollowing: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]); // New state for recent projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const dashboardRes = await apiClient.get('/mentor/dashboard');
        setDashboardData(dashboardRes.data);

        // Fetch recent projects
        const recentProjectsRes = await apiClient.get('/mentor/dashboard/recent-projects');
        if (recentProjectsRes.data.success) {
          setRecentProjects(recentProjectsRes.data.data);
        } else {
          throw new Error(recentProjectsRes.data.error || 'Failed to fetch recent projects');
        }

      } catch (err) {
        console.error("Error fetching mentor dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mentor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentorship Requests</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87m-1-12a4 4 0 0 1 3 3.87" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.mentorshipRequests}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/mentor/mentorship-requests" className="text-blue-500 hover:underline">
                View all requests
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mentorships</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeMentorships}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/mentor/active-mentorships" className="text-blue-500 hover:underline">
                View active mentorships
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Following</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.projectsFollowing}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/mentor/browse-projects" className="text-blue-500 hover:underline">
                Browse projects
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 flex flex-col space-y-2">
        <Link to="/mentor/profile" className="text-blue-500 hover:underline">
          View/Edit Profile
        </Link>
        <Link to="/mentor/articles" className="text-blue-500 hover:underline">
          My Articles (Knowledge Sharing)
        </Link>
        <Link to="/mentor/chat-with-mentees" className="text-blue-500 hover:underline">
          Chat with Mentees
        </Link>
      </div>

      {/* New Card for Recent Projects */}
      <div className="mt-8">
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
    </div>
  );
}

export default MentorDashboardPage;
