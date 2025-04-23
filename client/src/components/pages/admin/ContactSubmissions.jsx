import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import apiClient from '@/lib/apiClient';

function ContactSubmissions() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await apiClient.get('/messages');
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/messages/${id}`);
      fetchMessages(); // Refresh messages after deletion
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Contact Submissions</h1>

      <Table>
        <TableCaption>A list of your recent contact form submissions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message._id}>
              <TableCell className="font-medium">{message.name}</TableCell>
              <TableCell>{message.email}</TableCell>
              <TableCell>{message.subject}</TableCell>
              <TableCell>{message.message}</TableCell>
              <TableCell>{new Date(message.createdAt).toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="destructive" size="sm" onClick={() => handleDelete(message._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ContactSubmissions;