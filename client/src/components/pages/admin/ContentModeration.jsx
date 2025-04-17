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

function ContentModeration() {
  const reports = [
    {
      contentType: "Project",
      reportedBy: "John Doe",
      dateReported: "2024-04-16",
      reason: "Inappropriate content",
    },
    {
      contentType: "Comment",
      reportedBy: "Jane Smith",
      dateReported: "2024-04-15",
      reason: "Spam",
    },
  ];

  return (
    <main className="flex-1 px-6 pb-6  overflow-x-auto">
      <div className="bg-white rounded-lg h-full p-6">
        <h1>Content Moderation</h1>
        <Table>
          <TableCaption>A list of reported content.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Content Type</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Date Reported</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.dateReported}>
                <TableCell>{report.contentType}</TableCell>
                <TableCell>{report.reportedBy}</TableCell>
                <TableCell>{report.dateReported}</TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell>
                  <button>Remove</button>
                  <button>Keep</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

export default ContentModeration;