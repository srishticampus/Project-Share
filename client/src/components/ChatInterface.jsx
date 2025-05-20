import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient';
import Notifications from './Notifications';

function ChatInterface({ receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [senderId, setSenderId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get('/auth/profile');
        setSenderId(response.data._id);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!senderId) return;

    const fetchMessages = async () => {
      try {
        const response = await apiClient.get(`/messages/${senderId}/${receiverId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages.');
      }
    };

    fetchMessages();

    // Implement polling to check for new messages
    const intervalId = setInterval(fetchMessages, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, [senderId, receiverId]);

  const handleSendMessage = async () => {
    try {
      await apiClient.post('/messages', {
        sender: senderId,
        receiver: receiverId,
        content: newMessage
      });
      setNewMessage('');
      // Fetch messages again to update the chat
      const response = await apiClient.get(`/messages/${senderId}/${receiverId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${message.sender === senderId ? 'sent' : 'received'}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <Notifications />
      <div className="mt-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;