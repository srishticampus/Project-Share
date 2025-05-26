import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from '@/lib/apiClient';

function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSkill, setFilterSkill] = useState('');

  // Dummy data for categories and skills - replace with actual data from backend if available
  const categories = ["Web Development", "Mobile Development", "UI/UX Design", "Data Science"];
  const skills = ["React", "Node.js", "Python", "Figma", "AWS"];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // This API endpoint will need to be created/modified on the server
        const response = await apiClient.get('/mentor/browse-projects', {
          params: {
            search: searchTerm,
            category: filterCategory,
            skill: filterSkill,
          },
        });
        setProjects(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchTerm, filterCategory, filterSkill]);

  const handleFollowProject = async (projectId) => {
    try {
      // This API endpoint will need to be created on the server
      await apiClient.post(`/mentor/projects/${projectId}/follow`);
      // Optionally update UI to reflect that the project is now followed
      alert('Project followed successfully!');
    } catch (err) {
      console.error("Error following project:", err);
      alert('Failed to follow project.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Browse Projects</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Search projects by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select onValueChange={setFilterCategory} value={filterCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setFilterSkill} value={filterSkill}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Skills</SelectItem>
            {skills.map((skill) => (
              <SelectItem key={skill} value={skill}>{skill}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No projects found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <p className="text-sm text-gray-600">Creator: {project.creator.name}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2 line-clamp-3">{project.description}</p>
                <p className="text-sm text-gray-500">Category: {project.category}</p>
                <p className="text-sm text-gray-500">Skills: {project.requiredSkills.join(', ')}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Link to={`/project/${project._id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                  <Button onClick={() => handleFollowProject(project._id)} className="bg-purple-500 hover:bg-purple-600 text-white">
                    Follow Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseProjects;
