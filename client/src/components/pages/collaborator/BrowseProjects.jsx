import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming a select component for filtering
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient'; // Assuming an API client

function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSkills, setFilterSkills] = useState([]); // Assuming multiselect for skills
  const [loading, setLoading] = useState(true); // Add loading state

  // Dummy data for now
  const dummyProjects = [
    {
      _id: '1',
      title: 'Build a Personal Website',
      creator: 'John Doe',
      category: 'Web Development',
      description: 'Looking for a frontend developer to build a personal portfolio website.',
      skills: ['React', 'JavaScript', 'CSS'],
      timeline: '2 weeks',
    },
    {
      _id: '2',
      title: 'Mobile App for Task Management',
      creator: 'Jane Smith',
      category: 'Mobile Development',
      description: 'Need an Android developer for a new task management application.',
      skills: ['Android', 'Kotlin', 'Firebase'],
      timeline: '1 month',
    },
    {
      _id: '3',
      title: 'Data Analysis for Research Project',
      creator: 'Peter Jones',
      category: 'Data Science',
      description: 'Seeking a data analyst to help with data cleaning and analysis.',
      skills: ['Python', 'Pandas', 'NumPy'],
      timeline: '3 weeks',
    },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); // Set loading to true before fetch
      try {
        const response = await apiClient.get('/collaborator/projects', {
          params: { searchTerm, category: filterCategory, skills: filterSkills.join(',') }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // TODO: Set error state
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };
    fetchProjects();

  }, [searchTerm, filterCategory, filterSkills]); // Depend on filter states

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Browse Projects</h1>

        <div className="flex space-x-4 mb-6">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          {/* TODO: Implement category filter */}
          {/* <Select onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="mobile-development">Mobile Development</SelectItem>
              <SelectItem value="data-science">Data Science</SelectItem>
            </SelectContent>
          </Select> */}
          {/* TODO: Implement skills filter (multiselect) */}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Render skeleton loaders when loading
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-1" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-10 w-28" />
                </CardContent>
              </Card>
            ))
          ) : projects.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No projects found matching your criteria.</p>
          ) : (
            // Render actual projects when not loading
            projects.map((project) => (
              <Card key={project._id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Creator:</strong> {project.creator ? project.creator.name : 'N/A'}</p> {/* Display creator's name */}
                  <p><strong>Category:</strong> {project.category}</p>
                  <p><strong>Description:</strong> {project.description}</p>
                  <p><strong>Required Skills:</strong> {project?.skills?.join(', ')}</p> {/* Use optional chaining for skills */}
                  <p><strong>Timeline:</strong> {project.timeline}</p>
                  <Link to={`/collaborator/projects/${project._id}`}>
                    <Button className="mt-4">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default BrowseProjects;
