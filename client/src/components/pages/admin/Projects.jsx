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

function Projects() {
  const projects = [
    {
      title: "Project 1",
      creator: "John Doe",
      category: "Web Development",
      description: "A web application",
      skills: "React, Node.js",
      collaborators: 3,
      status: "Active",
    },
    {
      title: "Project 2",
      creator: "Jane Smith",
      category: "Data Science",
      description: "A data analysis project",
      skills: "Python, Machine Learning",
      collaborators: 5,
      status: "Completed",
    },
  ];

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
              <TableRow key={project.title}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.creator}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.skills}</TableCell>
                <TableCell>{project.collaborators}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>
                  <button>View</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

export default Projects;