import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card"
import { Link } from 'react-router';
import apiClient from '@/lib/apiClient';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalProjectCreators: 0,
    totalCollaborators: 0,
    totalMentors: 0,
    recentProjects: [],
    recentReports: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/admin/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

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
              <ul>
                {dashboardData.recentProjects.map((project) => (
                  <li key={project._id}>{project.name}</li>
                ))}
              </ul>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Recent Reports</h2>
              <ul>
                {dashboardData.recentReports.map((report) => (
                  <li key={report._id}>{report.title}</li>
                ))}
              </ul>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <Link to="/admin/profile">View Profile</Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;