import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/apiClient'; // Assuming an API client

function ConnectWithMentors() {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for now
  const dummyMentors = [
    {
      _id: 'mentor1',
      name: 'Mentor One',
      expertise: ['React', 'State Management'],
      experience: '10+ years',
    },
    {
      _id: 'mentor2',
      name: 'Mentor Two',
      expertise: ['Backend Development', 'Databases'],
      experience: '8 years',
    },
  ];

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await apiClient.get('/collaborator/mentors', {
          params: { searchTerm }
        });
        setMentors(response.data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        setError('Failed to fetch mentors.');
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();

  }, [searchTerm]); // Depend on searchTerm

  const handleRequestMentorshipClick = (mentorId) => {
    setSelectedMentorId(mentorId);
    setRequestMessage(''); // Clear previous message
  };

  const handleSendRequest = async (mentorId) => {
    try {
      await apiClient.post(`/collaborator/mentors/${mentorId}/request-mentorship`, { message: requestMessage });
      alert('Mentorship request submitted successfully!'); // Show success message
      setSelectedMentorId(null); // Clear selected mentor
      setRequestMessage(''); // Clear message
    } catch (error) {
      console.error('Error sending mentorship request:', error);
      setError('Failed to send mentorship request.'); // Show error message
    }
  };

  if (loading) {
    return <div>Loading mentors...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Connect with Mentors</h1>

        <div className="flex space-x-4 mb-6">
          <Input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {mentors.map((mentor) => (
            <Card key={mentor._id}>
              <CardContent>
                <p><strong>Name:</strong> {mentor.name}</p>
                <p><strong>Expertise:</strong> {mentor.expertise.join(', ')}</p>
                <p><strong>Experience:</strong> {mentor.experience}</p>
                {selectedMentorId === mentor._id ? (
                  <div className="mt-4 grid gap-2">
                    <Label htmlFor={`mentorship-message-${mentor._id}`}>Mentorship Request Message:</Label>
                    <Textarea
                      id={`mentorship-message-${mentor._id}`}
                      placeholder="Write your mentorship request message here..."
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                    />
                    <Button onClick={() => handleSendRequest(mentor._id)}>Send Request</Button>
                  </div>
                ) : (
                  <Button className="mt-4" onClick={() => handleRequestMentorshipClick(mentor._id)}>Request Mentorship</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ConnectWithMentors;