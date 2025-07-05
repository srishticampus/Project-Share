import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router';
import apiClient from '@/lib/apiClient'; // Assuming apiClient is in this path

const CreatorDashboardPage = () => {
  const [projectStats, setProjectStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
  });
  const [applicationStats, setApplicationStats] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]); // New state for recent projects
  const [projectProgress, setProjectProgress] = useState([]); // New state for project progress
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch project stats
        const projectRes = await apiClient.get('/creator/dashboard/project-stats');
        if (projectRes.data.success) {
          setProjectStats(projectRes.data.data);
        } else {
          throw new Error(projectRes.data.error || 'Failed to fetch project stats');
        }

        // Fetch application stats
        const applicationRes = await apiClient.get('/creator/dashboard/application-stats');
        if (applicationRes.data.success) {
          const stats = applicationRes.data.data;
          setApplicationStats([
            { name: 'New', applications: stats.newApplications },
            { name: 'Reviewed', applications: stats.reviewedApplications },
            { name: 'Accepted', applications: stats.acceptedApplications },
            { name: 'Rejected', applications: stats.rejectedApplications },
          ]);
        } else {
          throw new Error(applicationRes.data.error || 'Failed to fetch application stats');
        }

        // Fetch recent projects
        const recentProjectsRes = await apiClient.get('/creator/dashboard/recent-projects');
        if (recentProjectsRes.data.success) {
          setRecentProjects(recentProjectsRes.data.data);
        } else {
          throw new Error(recentProjectsRes.data.error || 'Failed to fetch recent projects');
        }

        // Fetch project progress
        const projectProgressRes = await apiClient.get('/creator/dashboard/project-progress');
        if (projectProgressRes.data.success) {
          setProjectProgress(projectProgressRes.data.data);
        } else {
          throw new Error(projectProgressRes.data.error || 'Failed to fetch project progress');
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <main className="flex-1 px-6 pb-6">Loading dashboard data...</main>;
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
            <p>Total Projects: {projectStats.totalProjects}</p>
            <p>Active Projects: {projectStats.activeProjects}</p>
            <p>Completed Projects: {projectStats.completedProjects}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={projectProgress}> {/* Use projectProgress here */}
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={applicationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="applications" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
            <div className="p-4 flex flex-col space-y-2">
              <Link to="/creator/profile" className="text-blue-500 hover:underline">View Profile</Link>
              <Link to="/creator/mentors" className="text-blue-500 hover:underline">Connect with Mentors</Link>
              <Link to="/creator/projectshare-ai-chat" className="text-blue-500 hover:underline">Chat with ProjectShare AI</Link>
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
};

export default CreatorDashboardPage;
