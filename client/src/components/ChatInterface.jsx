import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient';
import ReportForm from '@/components/ReportForm'; // Import ReportForm
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Import dropdown components
import { MoreHorizontal } from 'lucide-react'; // Import the 3-dot icon

import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
function ChatInterface({ receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [receiverData, setReceiverData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSenderData = async () => {
      try {
        const response = await apiClient.get('/auth/profile');
        setSenderId(response.data._id);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data.');
      }
    };

    const fetchReceiverData = async () => {
      try {
        const response = await apiClient.get(`/auth/user/${receiverId}`);
        setReceiverData(response.data);
      } catch (error) {
        console.error('Error fetching receiver data:', error);
        setError('Failed to fetch receiver data.');
      }
    };

    fetchSenderData();
    fetchReceiverData();
  }, [receiverId]);

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
      {receiverData && (
        <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center">
          <Button variant="outline"  size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft/>
          </Button>
          <div className="ml-2">
            <h2 className="text-lg font-semibold">{receiverData.name}</h2>
            <p className="text-gray-500">{receiverData.role}</p>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-2 p-2 rounded-lg relative group ${ // Added relative and group classes
              message.sender === senderId
                ? 'bg-blue-100 self-end text-right max-w-max'
                : 'bg-gray-100 self-start max-w-max'
            }`}
          >
            <p className="max-w-prose break-words">{message.content}</p>
            {/* Report Dropdown */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"> {/* Added classes for hover effect */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" className="bg-background hover:bg-accent text-foreground w-6 h-6"> {/* Adjusted button size */}
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}> {/* Prevent dropdown closing on form trigger click */}
                    {/* ReportForm Trigger */}
                    <ReportForm
                      className="w-full"
                      reportType="Message"
                      reportId={message._id}
                      onReportSubmit={handleReportSubmit}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

// Function to handle report submission for messages
const handleReportSubmit = async ({ reportType, reportId, reason, description }) => {
  try {
    const response = await apiClient.post('/reports', {
      reportType,
      reportId,
      reason,
      description,
    });
    console.log('Report submitted successfully:', response.data);
    alert('Report submitted successfully!'); // Provide user feedback
  } catch (error) {
    console.error('Error submitting report:', error);
    alert('Failed to submit report.'); // Provide user feedback
  }
};

export default ChatInterface;