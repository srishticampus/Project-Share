import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Avatar } from "@/components/ui/avatar"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { apiClient } from '@/lib/apiClient';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    // Display confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        await apiClient.delete(`/admin/users/${id}`);
        fetchUsers(); // Refresh user list after deletion
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleToggleActive = async (id, active) => {
    try {
      await apiClient.put(`/admin/users/${id}`, { active: !active });
      fetchUsers(); // Refresh user list after toggle
    } catch (error) {
      console.error('Failed to toggle active:', error);
    }
  };

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
                <TableCell><Avatar src={user.profilePicture} alt={user.fullName} /></TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={user.active}
                    onChange={() => {
                      handleToggleActive(user.id, user.active);
                      alert(
                        "Please contact Administrator for activation"
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteUser(user.id)}>Delete</Button>
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