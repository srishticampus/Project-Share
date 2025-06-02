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
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await apiClient.get('/contact'); // Fetch from the new contact endpoint
      console.log('API response data type:', typeof response.data);
      console.log('API response data:', response.data);
      setSubmissions(response.data); // Assuming response.data is the array of submissions
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/contact/${id}`); // Delete from the new contact endpoint
      fetchSubmissions(); // Refresh submissions after deletion
    } catch (error) {
      console.error("Error deleting contact submission:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 m-6">
      <h1 className="text-3xl font-bold mb-5">Contact Submissions</h1>

      <Table>
        <TableCaption>A list of your recent contact form submissions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Submitted At</TableHead> {/* Changed from Created At */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission._id}>
              <TableCell className="font-medium">{submission.name}</TableCell>
              <TableCell>{submission.email}</TableCell>
              <TableCell>{submission.subject}</TableCell>
              <TableCell>{submission.message}</TableCell>
              <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell> {/* Changed to submittedAt */}
              <TableCell className="text-right">
                <Button variant="destructive" size="sm" onClick={() => handleDelete(submission._id)}>
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
