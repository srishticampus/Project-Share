import React, { useState, useEffect } from 'react'; // Import useState and useEffect
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
import apiClient from '@/lib/apiClient'; // Import apiClient

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Import dropdown components
import { MoreHorizontal } from 'lucide-react'; // Import the 3-dot icon

function ContentModeration() {
  const [reports, setReports] = useState([]); // State to store fetched reports
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [selectedStatus, setSelectedStatus] = useState('pending'); // State for selected status, default to 'pending'

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await apiClient.get('/admin/reports', {
          params: { status: selectedStatus } // Pass selectedStatus as query parameter
        });
        console.log('Fetched reports:', response.data);
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError('Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedStatus]); // Empty dependency array means this effect runs once on mount

  const handleRemoveReport = async (reportId) => {
    const confirmRemove = window.confirm(
      `Are you sure you want to remove this report?`
    );
    if (confirmRemove) {
      try {
        await apiClient.delete(`/admin/reports/${reportId}`);
        // Remove the report from the local state
        setReports(reports.filter(report => report._id !== reportId));
        alert('Report removed successfully.');
      } catch (error) {
        console.error('Error removing report:', error);
        alert('Failed to remove report.');
      }
    }
  };

  // Handle marking a report as resolved
  const handleResolveReport = async (reportId) => {
    const confirmResolve = window.confirm(
      `Are you sure you want to mark this report as resolved?`
    );
    if (confirmResolve) {
      try {
        await apiClient.put(`/admin/reports/${reportId}/resolve`);
        // Remove the report from the local state as resolved reports won't show in pending
        setReports(reports.filter(report => report._id !== reportId));
        alert('Report marked as resolved.');
      } catch (error) {
        console.error('Error marking report as resolved:', error);
        alert('Failed to mark report as resolved.');
      }
    }
  };

  const handleKeepReport = async (reportId) => {
    const notes = prompt(
      `Enter notes for keeping this report:`
    );
    if (notes !== null) { // Check if prompt was not cancelled
      try {
        await apiClient.put(`/admin/reports/${reportId}/keep`, { notes });
        // Optionally update the report status in the local state
        setReports(reports.map(report =>
          report._id === reportId ? { ...report, status: 'kept', action: 'Keep with notes', notes: notes } : report
        ));
        alert('Report marked as kept with notes.');
      } catch (error) {
        console.error('Error keeping report:', error);
        alert('Failed to keep report.');
      }
    }
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex-1 px-6 pb-6  overflow-x-auto">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Content Moderation</h1> {/* Added margin-bottom */}

        {/* Status Filter */}
        <div className="mb-4"> {/* Added margin-bottom */}
          <label htmlFor="status-filter" className="mr-2">Filter by Status:</label>
          <Select onValueChange={setSelectedStatus} value={selectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="removed">Removed</SelectItem>
              <SelectItem value="kept">Kept</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableCaption>A list of reported content.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Content Type</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Date Reported</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Description</TableHead> {/* Added Description column */}
              <TableHead>Notes</TableHead> {/* Added Notes column */}
              <TableHead>Status</TableHead> {/* Added Status column */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report._id}> {/* Use report._id as key */}
                <TableCell>{report.contentType}</TableCell>
                <TableCell>{report.reportedBy ? report.reportedBy.name : 'N/A'}</TableCell> {/* Display reportedBy name */}
                <TableCell>{new Date(report.dateReported).toLocaleDateString()}</TableCell> {/* Format date */}
                <TableCell>{report.reason}</TableCell>
                <TableCell>{report.description}</TableCell> {/* Display description */}
                <TableCell>{report.notes || 'N/A'}</TableCell> {/* Display notes, show N/A if no notes */}
                <TableCell>{report.status}</TableCell> {/* Display status */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRemoveReport(report._id)}> {/* Remove option */}
                        Mark as Removed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleKeepReport(report._id)}> {/* Keep option */}
                        Mark as Kept
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleResolveReport(report._id)}> {/* Resolve option */}
                        Mark as Resolved
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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