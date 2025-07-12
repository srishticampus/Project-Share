import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient'; // Assuming an API client

function ChatWithCreators() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get(`/messages/users`, {
          params: { searchTerm }
        });
        setUsers(response.data);
        console.log('API Response Data:', response.data); // Log the response data
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

  }, [searchTerm]); // Depend on searchTerm

  const handleChatClick = (userId) => {
    // Navigate to the chat interface with this user
    console.log(`Initiate chat with user ${userId}`);
  };
  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <h1 className="text-2xl font-semibold mb-4">Chat with Members</h1>
          <div className="flex space-x-4 mb-6">
            <Skeleton className="h-10 w-64" /> {/* Skeleton for search input */}
          </div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {[...Array(4)].map((_, index) => ( // Render 4 skeleton cards for users
              <Card key={index}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-5 w-48" />
                  </div>
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
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

        {Object.entries(
          users.reduce((acc, user) => {
            const role = user.role || 'unspecified';
            if (!acc[role]) {
              acc[role] = [];
            }
            acc[role].push(user);
            return acc;
          }, {})
        ).map(([role, usersInRole]) => (
          <div key={role} className="mb-6">
            <h2 className="text-xl font-semibold mb-3 capitalize">{role}s</h2>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {usersInRole.map((user) => (
                <Card key={user._id}>
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <p><strong>Name:</strong> {user.name}</p>
                      <p className="text-sm text-gray-500">Role: {user.role}</p>
                    </div>
                    <Link to={`/collaborator/chat/${user._id}`}>
                      <Button onClick={() => handleChatClick(user._id)}>Chat</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default ChatWithCreators;
