import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiClient from '@/lib/apiClient'; // Import the apiClient

function Analytics() {
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userEngagementData, setUserEngagementData] = useState([]);
  const [projectSuccessRateData, setProjectSuccessRateData] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [popularCategoriesData, setPopularCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [userGrowthResponse, userEngagementResponse, projectSuccessRateResponse, popularCategoriesResponse] = await Promise.all([
          apiClient.get('/admin/analytics/user-growth'),
          apiClient.get('/admin/analytics/user-engagement'),
          apiClient.get('/admin/analytics/project-success-rate'),
          apiClient.get('/admin/analytics/popular-categories'),
        ]);

        setUserGrowthData(userGrowthResponse.data);
        setUserEngagementData(userEngagementResponse.data);
        setProjectSuccessRateData(projectSuccessRateResponse.data.successRateData);
        setTotalProjects(projectSuccessRateResponse.data.totalProjects);
        setCompletedProjects(projectSuccessRateResponse.data.completedProjects);
        setPopularCategoriesData(popularCategoriesResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <main className="flex-1 px-6 pb-6"><div className="bg-white rounded-lg h-full p-6">Loading Analytics...</div></main>;
  }

  if (error) {
    return <main className="flex-1 px-6 pb-6"><div className="bg-white rounded-lg h-full p-6 text-red-500">Error loading analytics: {error.message}</div></main>;
  }

  const successRateValue = projectSuccessRateData.length > 0 ? projectSuccessRateData[0].value : 0;

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1>Platform Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg">
            <h2>User Engagement</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={userEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Active Users" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="border p-4 rounded-lg">
            <h2>Project Success Rate</h2>
            {totalProjects > 0 ? (
              <p className="text-lg font-semibold mb-2">Success Rate: {successRateValue.toFixed(2)}% ({completedProjects} of {totalProjects} projects completed)</p>
            ) : (
              <p className="text-lg font-semibold mb-2">No projects available to calculate success rate.</p>
            )}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={projectSuccessRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border p-4 rounded-lg">
            <h2>Popular Categories</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={popularCategoriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="projects" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border p-4 rounded-lg">
            <h2>User Growth</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Analytics;
