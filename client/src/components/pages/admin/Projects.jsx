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
import { Link } from 'react-router';
import apiClient from '@/lib/apiClient';
import { Input } from '@/components/ui/input';

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('/admin/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/admin/projects/${id}`);
      setProjects(projects.filter((project) => project._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/admin/projects/${id}`, { status: newStatus });
      setProjects(
        projects.map((project) =>
          project._id === id ? { ...project, status: newStatus } : project
        )
      );
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  return (
    <main className="flex-1 px-6 pb-6 overflow-x-auto">
      <div className="bg-white rounded-lg h-full p-6">
        <h1>Projects</h1>
        <Table>
          <TableCaption>A list of projects.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Project Title</TableHead>
              <TableHead>Project Creator</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Required Skills</TableHead>
              <TableHead>Collaborators</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.creator}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.skills}</TableCell>
                <TableCell>{project.collaborators}</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={project.status}
                    onChange={(e) =>
                      handleUpdateStatus(project._id, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button>View</Button>
                  <Button onClick={() => handleDelete(project._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link to="/admin/projects" className="text-blue-500">View all</Link>
      </div>
    </main>
  );
}

export default Projects;