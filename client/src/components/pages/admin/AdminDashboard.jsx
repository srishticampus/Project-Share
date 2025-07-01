import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card"
import { Link } from 'react-router';
import apiClient from '@/lib/apiClient';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalProjectCreators: 0,
    totalCollaborators: 0,
    totalMentors: 0,
    recentReports: [],
  });
  const [recentProjects, setRecentProjects] = useState([]); // Separate state for recent projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch general dashboard stats
        const dashboardRes = await apiClient.get('/admin/dashboard');
        setDashboardData(dashboardRes.data);

        // Fetch recent projects specifically
        const recentProjectsRes = await apiClient.get('/admin/dashboard/recent-projects');
        if (recentProjectsRes.data.success) {
          setRecentProjects(recentProjectsRes.data.data);
        } else {
          throw new Error(recentProjectsRes.data.error || 'Failed to fetch recent projects');
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
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
      <div className="bg-white rounded-lg h-full p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Total Project Creators</h2>
              <p className="text-2xl">{dashboardData.totalProjectCreators}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Total Collaborators</h2>
              <p className="text-2xl">{dashboardData.totalCollaborators}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Total Mentors/Experts</h2>
              <p className="text-2xl">{dashboardData.totalMentors}</p>
            </div>
          </Card>
          <Card className="md:col-span-2">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Recent Projects</h2>
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
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Recent Reports</h2>
              <div className="space-y-2">
                {dashboardData.recentReports.map((report) => (
                  <Card key={report._id} className="p-3 text-sm">
                    <div>
                      <strong>Type:</strong> {report.contentType} - 
                      {report.contentType === 'Project' && report.contentId && report.contentId.title && (
                        <span> <strong>Title:</strong> {report.contentId.title}</span>
                      )}
                      {(report.contentType === 'Comment' || report.contentType === 'Message') && report.contentId && report.contentId.text && (
                        <span> <strong>Content:</strong> "{report.contentId.text.substring(0, 50)}..."</span>
                      )}
                    </div>
                    <div>
                      <strong>Reason:</strong> {report.reason} - <em>{report.description}</em>
                    </div>
                    {report.reportedBy && (
                      <div className="text-xs text-gray-600">
                        <strong>Reported By:</strong> {report.reportedBy.name} ({report.reportedBy.email})
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;
