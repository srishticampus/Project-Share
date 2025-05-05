import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient'; // Assuming an API client

function ChatWithCreators() {
  const [creators, setCreators] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for now
  const dummyCreators = [
    {
      _id: 'creator1',
      name: 'John Doe',
      project: 'Build a Personal Website', // Assuming the project they are collaborating on or applied to
    },
    {
      _id: 'creator2',
      name: 'Jane Smith',
      project: 'Mobile App for Task Management',
    },
  ];

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await apiClient.get('/collaborator/chat/creators', {
          params: { searchTerm }
        });
        setCreators(response.data);
        console.log('API Response Data:', response.data); // Log the response data
      } catch (error) {
        console.error('Error fetching creators:', error);
        setError('Failed to fetch creators.');
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();

  }, [searchTerm]); // Depend on searchTerm

  const handleChatClick = (creatorId) => {
    // TODO: Navigate to the chat interface with this creator
    console.log(`Initiate chat with creator ${creatorId}`);
    // Example: navigate(`/chat/${creatorId}`);
  };

  if (loading) {
    return <div>Loading creators...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Chat with Project Creators</h1>

        <div className="flex space-x-4 mb-6">
          <Input
            type="text"
            placeholder="Search creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {creators.map((creator) => (
            <Card key={creator._id}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p><strong>Name:</strong> {creator.name}</p>
                  <p className="text-sm text-gray-500">Projects: {creator.projects.join(', ')}</p>
                </div>
                <Button onClick={() => handleChatClick(creator._id)}>Chat</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ChatWithCreators;