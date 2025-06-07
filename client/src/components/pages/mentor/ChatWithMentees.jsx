import React, { useState, useEffect } from 'react';
import { Link } from 'react-router'; // Using 'react-router' as per user's preference
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from '@/lib/apiClient';

function ChatWithMentees() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        // This API endpoint will need to be created on the server
        const response = await apiClient.get('/mentor/mentees');
        setMentees(response.data);
      } catch (err) {
        console.error("Error fetching mentees:", err);
        setError("Failed to load mentees.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  const filteredMentees = mentees.filter(mentee =>
    mentee.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.requester.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading mentees...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Chat with Mentees</h1>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search mentees by name or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMentees.length === 0 ? (
        <p className="text-center text-gray-500">No mentees found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredMentees.map((mentee) => (
            <Card key={mentee._id}>
              <CardHeader>
                <CardTitle>{mentee.requester.name} ({mentee.requester.role})</CardTitle>
              </CardHeader>
              <CardContent>
                {mentee.project && (
                  <p className="text-sm text-gray-600 mb-2">
                    Project: <span className="font-medium">{mentee.project.title}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500">Mentorship started: {new Date(mentee.requestDate).toLocaleDateString()}</p>
                <div className="mt-4">
                  <Link to={`/mentor/chat/${mentee.requester._id}`}>
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

export default ChatWithMentees;
