import React, { useState, useEffect } from 'react';
import { Link } from 'react-router'; // Import Link
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient';

function CreatorApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiClient.get('/creator/applications');
        setApplications(response.data.data); // Assuming the API returns data in the 'data' field
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error('Error fetching applications:', err);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await apiClient.put(`/applications/${applicationId}/status`, { status });
      // Update the status in the local state
      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error(`Error updating application status to ${status}:`, error);
      alert(`Failed to ${status} application.`);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 md:p-6 lg:p-8">Loading applications...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 md:p-6 lg:p-8 text-red-500">Error loading applications: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Project Applications</CardTitle>
          <CardDescription>View and manage applications for your projects.</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead className="hidden md:table-cell">Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Profile</TableHead> {/* New Profile column */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell className="font-medium">{application.projectId?.title || 'N/A'}</TableCell>
                    <TableCell>{application.applicantId?.name || 'N/A'}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">{application.message}</TableCell>
                    <TableCell>{application.status}</TableCell>
                    <TableCell>
                      {application.applicantId?._id ? (
                        <Link to={`/collaborator/profile/${application.applicantId._id}`}>
                          <Button variant="outline" size="sm">View Profile</Button>
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {application.status === 'Pending' && (
                        <>
                          <Button variant="outline" size="sm" className="mr-2" onClick={() => handleStatusUpdate(application._id, 'Accepted')}>Accept</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate(application._id, 'Rejected')}>Reject</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">No applications found for your projects.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CreatorApplications;
