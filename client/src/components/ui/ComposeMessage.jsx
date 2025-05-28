import React, { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

function ComposeMessage() {
  const [receiverId, setReceiverId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace 'senderId' with the actual user ID (e.g., from local storage or context)
      const senderId = 'someSenderId'; // Replace with actual user ID
      const response = await apiClient.post('/messages/send', {
        senderId,
        receiverId,
        subject,
        content
      });

      setMessage('Message sent successfully!');
      setReceiverId('');
      setSubject('');
      setContent('');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage('Failed to send message.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <Textarea
        placeholder="Message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <Button type="submit">Send</Button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default ComposeMessage;