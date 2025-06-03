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
import { Avatar,AvatarImage,AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react" // Import the ellipsis icon
import apiClient from '@/lib/apiClient';
import { API_URL } from '@/lib/constant';

function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true before fetch
    try {
      const response = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
      console.log(response.data);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.totalUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false); // Set loading to false after fetch
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

  const handleToggleVerified = async (id, isVerified) => {
    try {
      await apiClient.put(`/admin/users/${id}`, { isVerified: !isVerified });
      fetchUsers(); // Refresh user list after toggle
    } catch (error) {
      console.error('Failed to toggle verification status:', error);
    }
  };

  const handleToggleApproved = async (id, isApproved) => {
    try {
      await apiClient.put(`/admin/users/${id}/approve`, { isApproved: !isApproved });
      fetchUsers(); // Refresh user list after toggle
    } catch (error) {
      console.error('Failed to toggle approval status:', error);
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
              <TableHead>Approved</TableHead> {/* New TableHead for Approved */}
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Render skeleton rows when loading
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : (
              // Render actual user rows when not loading
              users && users?.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                    <Avatar >
                      <AvatarImage src={user.photo && `${API_URL}/${user.photo}` }  />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
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
                  <TableCell>
                    {user.role === 'creator' ? (user.isApproved ? 'Yes' : 'No') : 'N/A'}
                  </TableCell> {/* Display N/A if not a creator */}
                  <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" /> {/* Replaced "Actions" text with icon */}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleDeleteUser(user._id)}>Delete</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleVerified(user._id, user.isVerified)}>
                          {user.isVerified ? 'Unverify' : 'Verify'}
                        </DropdownMenuItem>
                        {user.role === 'creator' && (
                          <DropdownMenuItem onClick={() => handleToggleApproved(user._id, user.isApproved)}>
                            {user.isApproved ? 'Disapprove' : 'Approve'}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
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
