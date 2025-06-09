import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router'; 
import apiClient from '@/lib/apiClient';

function ActiveMentorships() {
  const [activeMentorships, setActiveMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveMentorships = async () => {
      try {
        // This API endpoint will need to be created on the server
        const response = await apiClient.get('/mentor/active-mentorships');
        setActiveMentorships(response.data);
      } catch (err) {
        console.error("Error fetching active mentorships:", err.response || err.message || err);
        setError("Failed to load active mentorships.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveMentorships();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading active mentorships...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Active Mentorships</h1>
      {activeMentorships.length === 0 ? (
        <p className="text-center text-gray-500">No active mentorships found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activeMentorships.map((mentorship) => (
            <Card key={mentorship._id}>
              <CardHeader>
                <CardTitle>{mentorship.requester.name} ({mentorship.requester.role})</CardTitle>
              </CardHeader>
              <CardContent>
                {mentorship.project && (
                  <p className="text-sm text-gray-600 mb-2">
                    Project: <span className="font-medium">{mentorship.project.title}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500 mb-1">Started on: {new Date(mentorship.requestDate).toLocaleDateString()}</p>
                {mentorship.status && (
                  <p className="text-sm text-gray-500 mb-1">Status: <span className="font-medium">{mentorship.status}</span></p>
                )}
                {mentorship.duration && (
                  <p className="text-sm text-gray-500 mb-1">Duration: <span className="font-medium">{mentorship.duration}</span></p>
                )}
                {mentorship.mentorshipGoals && (
                  <p className="text-sm text-gray-500 mb-1">Goals: <span className="font-medium">{mentorship.mentorshipGoals}</span></p>
                )}
                {mentorship.lastMessageDate && (
                  <p className="text-sm text-gray-500 mb-1">Last message: {new Date(mentorship.lastMessageDate).toLocaleDateString()}</p>
                )}
                <div className="mt-4 flex space-x-2">
                  <Link to={`/mentor/mentorship-details/${mentorship._id}`}>
                    <Button variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-600">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/mentor/chat/${mentorship.requester._id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      Chat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActiveMentorships;
