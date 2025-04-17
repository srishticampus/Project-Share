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
import { Button } from '@/components/ui/button';

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

  const handleRemoveReport = (contentType, reportedBy, dateReported) => {
    const confirmRemove = window.confirm(
      `Are you sure you want to remove the reported ${contentType} reported by ${reportedBy} on ${dateReported}?`
    );
    if (confirmRemove) {
      // Remove the report
      alert(`Reported ${contentType} removed.`);
    }
  };

  const handleKeepReport = (contentType, reportedBy, dateReported) => {
    const notes = prompt(
      `Enter notes for keeping the reported ${contentType} reported by ${reportedBy} on ${dateReported}:`
    );
    if (notes) {
      // Keep the report with notes
      alert(`Reported ${contentType} kept with notes: ${notes}`);
    }
  };

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
                  <Button onClick={() => handleRemoveReport(report.contentType, report.reportedBy, report.dateReported)}>
                    Remove
                  </Button>
                  <Button onClick={() => handleKeepReport(report.contentType, report.reportedBy, report.dateReported)}>
                    Keep
                  </Button>
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