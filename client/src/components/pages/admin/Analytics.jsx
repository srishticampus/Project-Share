import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

function Analytics() {
  const analyticsData = [
    {
      metric: "User Engagement",
      value: "80%",
    },
    {
      metric: "Project Success Rate",
      value: "60%",
    },
    {
      metric: "Popular Categories",
      value: "Web Development, Data Science",
    },
    {
      metric: "User Growth",
      value: "20%",
    },
  ];

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1>Platform Analytics</h1>
        <Table>
          <TableCaption>A list of platform analytics.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyticsData.map((data) => (
              <TableRow key={data.metric}>
                <TableCell>{data.metric}</TableCell>
                <TableCell>{data.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

export default Analytics;