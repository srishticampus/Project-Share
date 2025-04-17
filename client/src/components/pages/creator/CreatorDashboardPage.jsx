import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router';

const CreatorDashboardPage = () => {
  // Dummy data for the charts
  const projectProgressData = [
    { name: 'Week 1', progress: 20 },
    { name: 'Week 2', progress: 40 },
    { name: 'Week 3', progress: 60 },
    { name: 'Week 4', progress: 80 },
    { name: 'Week 5', progress: 100 },
  ];

  const applicationStatsData = [
    { name: 'New', applications: 30 },
    { name: 'Reviewed', applications: 20 },
    { name: 'Accepted', applications: 15 },
    { name: 'Rejected', applications: 5 },
  ];

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Projects: 10</p>
            <p>Active Projects: 7</p>
            <p>Completed Projects: 3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={projectProgressData}>
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
                <BarChart data={applicationStatsData}>
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
            <div className="p-4">
              <Link to="/creator/profile">View Profile</Link>
            </div>
          </Card>
      </div>
    </main>
  );
};

export default CreatorDashboardPage;