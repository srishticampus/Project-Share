import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import apiClient from '@/lib/apiClient';

function MentorshipDetails() {
  const { id } = useParams(); // Get mentorship ID from URL
  const [mentorship, setMentorship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorshipDetails = async () => {
      try {
        // This API endpoint will need to be created on the server
        const response = await apiClient.get(`/mentor/mentorships/${id}`);
        setMentorship(response.data);
      } catch (err) {
        console.error("Error fetching mentorship details:", err.response || err.message || err);
        setError("Failed to load mentorship details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentorshipDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading mentorship details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!mentorship) {
    return <div className="text-center py-8 text-gray-500">Mentorship not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mentorship Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mentorship with {mentorship.requester.name} ({mentorship.requester.role})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            {mentorship.requester.photo && (
              <img src={mentorship.requester.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            )}
            <div>
              <p className="text-lg font-semibold">{mentorship.requester.name}</p>
              <p className="text-sm text-gray-600">{mentorship.requester.role}</p>
              {mentorship.requester.email && <p className="text-sm text-gray-500">Email: {mentorship.requester.email}</p>}
              {mentorship.requester.contactNumber && <p className="text-sm text-gray-500">Contact: {mentorship.requester.contactNumber}</p>}
            </div>
          </div>

          {mentorship.requester.bio && (
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-1">Bio:</h3>
              <p className="text-sm text-gray-700">{mentorship.requester.bio}</p>
            </div>
          )}

          {mentorship.requester.skills && mentorship.requester.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-1">Skills:</h3>
              <p className="text-sm text-gray-700">{mentorship.requester.skills.join(', ')}</p>
            </div>
          )}

          {mentorship.requester.portfolioLinks && mentorship.requester.portfolioLinks.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-1">Portfolio Links:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {mentorship.requester.portfolioLinks.map((link, index) => (
                  <li key={index}><a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{link}</a></li>
                ))}
              </ul>
            </div>
          )}

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

          {mentorship.requesterProjects && mentorship.requesterProjects.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">
                {mentorship.requester.role === 'creator' ? 'Projects Created' : 'Projects Contributing To'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {mentorship.requesterProjects.map((project) => (
                  <Card key={project._id} className="p-4">
                    <CardTitle className="text-md font-semibold">{project.title}</CardTitle>
                    <CardContent className="p-0">
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Status: {project.status}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <Link to={`/mentor/chat/${mentorship.requester._id}`}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Chat with {mentorship.requester.name}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MentorshipDetails;
