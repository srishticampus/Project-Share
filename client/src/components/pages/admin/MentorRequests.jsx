import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

function MentorRequests() {
  const mentorRequests = [
    {
      name: "John Doe",
      photo: "url",
      contactNumber: "123-456-7890",
      email: "john.doe@example.com",
      expertise: "Software Engineering",
      experience: 5,
    },
    {
      name: "Jane Smith",
      photo: "url",
      contactNumber: "987-654-3210",
      email: "jane.smith@example.com",
      expertise: "Data Science",
      experience: 3,
    },
  ];

  return (
    <main className="flex-1 px-6 pb-6  overflow-x-auto">
      <div className="bg-white rounded-lg h-full p-6">
        <h1>Mentor Requests</h1>
        <Table>
          <TableCaption>A list of mentor requests.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Expertise</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentorRequests.map((request) => (
              <TableRow key={request.email}>
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.photo}</TableCell>
                <TableCell>{request.contactNumber}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.expertise}</TableCell>
                <TableCell>{request.experience}</TableCell>
                <TableCell>
                  <button>Approve</button>
                  <button>Reject</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

export default MentorRequests;