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
import  apiClient from '@/lib/apiClient';

function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
      console.log(response.data);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.totalUsers);
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
      await apiClient.put(`/admin/users/${id}`, { isVerified: !active });
      fetchUsers(); // Refresh user list after toggle
    } catch (error) {
      console.error('Failed to toggle active:', error);
    }
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1); // Reset to first page when limit changes
  };

  return (
    <main className="flex-1 px-6 pb-6 overflow-x-auto">
      <div className="bg-white rounded-lg h-full p-6">
        <h1>Users</h1>
        <Table>
          <TableCaption>A list of users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users?.map((user) => (
              <TableRow key={user.email}>
                <TableCell>
                  <Avatar src={user.photo || "https://github.com/shadcn.png"} alt={user.name} />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.contactNumber || 'N/A'}</TableCell>
                <TableCell>{user.country || 'N/A'}</TableCell>
                <TableCell>{user.city || 'N/A'}</TableCell>
                <TableCell>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{user.gender || 'N/A'}</TableCell>
                <TableCell>{user.isVerified ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                  <Button onClick={() => handleToggleActive(user._id, user.isVerified)}>
                    {user.isVerified ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <Button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </Button>
          <span>
            Page {page} of {totalPages} (Total Users: {totalUsers})
          </span>
          <Button onClick={handleNextPage} disabled={page === totalPages}>
            Next
          </Button>
          <div>
            <label htmlFor="limit" className="mr-2">
              Users per page:
            </label>
            <select
              id="limit"
              value={limit}
              onChange={handleLimitChange}
              className="border rounded px-2 py-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Users;
