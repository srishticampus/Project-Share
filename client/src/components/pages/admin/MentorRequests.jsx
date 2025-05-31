import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Avatar } from "@/components/ui/avatar";
import { Link } from 'react-router';
import apiClient from '@/lib/apiClient'; // Import apiClient

function MentorRequests() {
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorRequests = async () => {
      try {
        // This API endpoint will be created on the server
        const response = await apiClient.get('/admin/mentor-requests');
        setMentorRequests(response.data);
      } catch (err) {
        console.error("Error fetching mentor requests:", err);
        setError("Failed to load mentor requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentorRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await apiClient.put(`/admin/mentor-requests/${requestId}/status`, { status });
      // Remove the request from the list after it's processed
      setMentorRequests(mentorRequests.filter(req => req._id !== requestId));
      alert(`Mentor request ${status} successfully!`);
    } catch (err) {
      console.error(`Error updating request status to ${status}:`, err);
      setError(`Failed to ${status} mentor request.`);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6 overflow-x-auto">
        <div className="bg-white rounded-lg h-full p-6">
          <p className="text-center py-8">Loading mentor requests...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 px-6 pb-6 overflow-x-auto">
        <div className="bg-white rounded-lg h-full p-6">
          <p className="text-center py-8 text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 pb-6  overflow-x-auto">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Mentor Requests</h1>
        {mentorRequests.length === 0 ? (
          <p className="text-center text-gray-500">No pending mentor requests.</p>
        ) : (
          <Table>
            <TableCaption>A list of pending mentor requests.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentorRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.requester.name}</TableCell>
                  <TableCell>
                    <Avatar src={request.requester.photo || "https://github.com/shadcn.png"} alt={request.requester.name} />
                  </TableCell>
                  <TableCell>{request.requester.contactNumber}</TableCell>
                  <TableCell>{request.requester.email}</TableCell>
                  <TableCell>{request.requester.areasOfExpertise ? request.requester.areasOfExpertise.join(', ') : 'N/A'}</TableCell>
                  <TableCell>{request.requester.yearsOfExperience} years</TableCell>
                  <TableCell className="space-x-2">
                    <Button onClick={() => handleStatusUpdate(request._id, 'accepted')} className="bg-green-500 hover:bg-green-600 text-white">
                      Approve
                    </Button>
                    <Button onClick={() => handleStatusUpdate(request._id, 'rejected')} className="bg-red-500 hover:bg-red-600 text-white">
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {/* The "See all" link might be redundant if this page already shows all pending requests */}
        {/* <Link to="/admin/mentor-requests" className="text-blue-500">See all</Link> */}
      </div>
    </main>
  );
}

export default MentorRequests;
