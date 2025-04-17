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

function Users() {
  const users = [
    {
      fullName: "John Doe",
      email: "john.doe@example.com",
      dob: "1990-01-01",
      gender: "Male",
      country: "USA",
      city: "New York",
      contactNumber: "123-456-7890",
      userType: "Project Creator",
      profilePicture: "url",
      active: true,
    },
    {
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      dob: "1992-02-02",
      gender: "Female",
      country: "Canada",
      city: "Toronto",
      contactNumber: "987-654-3210",
      userType: "Collaborator",
      profilePicture: "url",
      active: false,
    },
  ];

  return (
    <main className="flex-1 px-6 pb-6 overflow-x-auto">
      <div className="bg-white rounded-lg h-full p-6">
        <h1>Users</h1>
        <Table>
          <TableCaption>A list of users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Profile Picture</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.dob}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.country}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{user.contactNumber}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>{user.profilePicture}</TableCell>
                <TableCell>{user.active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <button>Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

export default Users;