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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await apiClient.get('/admin/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching (or error)
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
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Table>
            <TableCaption>A list of projects.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Tech Stack</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Collaborators</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.creator ? project.creator.name : 'N/A'}</TableCell>
                  <TableCell>{project.techStack && project.techStack.length > 0 ? project.techStack.join(', ') : 'N/A'}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.collaborators && project.collaborators.length > 0 ? project.collaborators.map(collab => collab.name).join(', ') : 'None'}</TableCell>
                  <TableCell>
                    <Select
                      value={project.status}
                      onValueChange={(newStatus) => handleUpdateStatus(project._id, newStatus)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Link to={`/projects/${project._id}`}>
                      <Button variant="outline" className="mr-2">View</Button>
                    </Link>
                    <Button onClick={() => handleDelete(project._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
}

export default Projects;
