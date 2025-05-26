import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import apiClient from '@/lib/apiClient';

function MentorshipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiClient.get('/mentor/mentorship-requests');
        setRequests(response.data);
      } catch (err) {
        console.error("Error fetching mentorship requests:", err);
        setError("Failed to load mentorship requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await apiClient.put(`/mentor/mentorship-requests/${requestId}/status`, { status });
      setRequests(requests.filter(req => req._id !== requestId)); // Remove from list after action
    } catch (err) {
      console.error(`Error updating request status to ${status}:`, err);
      setError(`Failed to ${status} request.`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading mentorship requests...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mentorship Requests</h1>
      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No pending mentorship requests.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <Card key={request._id}>
              <CardHeader>
                <CardTitle>{request.requester.name} ({request.requester.role})</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">{request.message}</p>
                {request.project && (
                  <p className="text-sm text-gray-600 mb-2">
                    Project: <span className="font-medium">{request.project.title}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500">Requested on: {new Date(request.requestDate).toLocaleDateString()}</p>
                <div className="mt-4 space-x-2">
                  <Button onClick={() => handleStatusUpdate(request._id, 'accepted')} className="bg-green-500 hover:bg-green-600 text-white">
                    Accept
                  </Button>
                  <Button onClick={() => handleStatusUpdate(request._id, 'rejected')} className="bg-red-500 hover:bg-red-600 text-white">
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MentorshipRequests;
