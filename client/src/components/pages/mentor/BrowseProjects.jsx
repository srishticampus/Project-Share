import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient';
import recommendationService from '@/services/recommendationService'; // Import recommendationService
import { expertiseOptions } from '@/lib/constant';

function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [recommendedProjects, setRecommendedProjects] = useState([]); // New state for recommended projects
  const [loadingRecommendations, setLoadingRecommendations] = useState(true); // New state for loading recommendations
  const [recommendationError, setRecommendationError] = useState(null); // New state for recommendation error
  const [availableSkills, setAvailableSkills] = useState([]); // New state for dynamically fetched skills

  // Use expertiseOptions for categories to ensure consistency
  const categories = expertiseOptions;

  useEffect(() => {
    const fetchRecommendedProjects = async () => {
      try {
        setLoadingRecommendations(true);
        const [recommendedResponse, followedProjectsResponse] = await Promise.all([
          recommendationService.getRecommendedProjectsForMentor(),
          apiClient.get('/mentor/projects/followed')
        ]);

        const followedProjectIds = new Set(followedProjectsResponse.data.map(p => p._id));

        setRecommendedProjects(recommendedResponse.map(project => ({
          ...project,
          isFollowed: followedProjectIds.has(project._id)
        })));
      } catch (err) {
        console.error("Error fetching recommended projects for mentor:", err);
        setRecommendationError("Failed to load recommended projects.");
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendedProjects();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true); // Set loading for main projects
        const [projectsResponse, followedProjectsResponse] = await Promise.all([
          apiClient.get('/mentor/browse-projects', {
            params: {
              search: searchTerm,
              category: filterCategory === 'all' ? '' : filterCategory,
              skill: filterSkill === 'all' ? '' : filterSkill,
            },
          }),
          apiClient.get('/mentor/projects/followed')
        ]);

        const followedProjectIds = new Set(followedProjectsResponse.data.map(p => p._id));

        setProjects(projectsResponse.data.map(project => ({
          ...project,
          isFollowed: followedProjectIds.has(project._id)
        })));

        // Extract unique tech stacks for skill filtering
        const uniqueSkills = new Set();
        projectsResponse.data.forEach(project => {
          if (project.techStack && Array.isArray(project.techStack)) {
            project.techStack.forEach(skill => uniqueSkills.add(skill));
          }
        });
        setAvailableSkills(Array.from(uniqueSkills).sort()); // Sort for consistent display

      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false); // Unset loading for main projects
      }
    };

    fetchProjects();
  }, [searchTerm, filterCategory, filterSkill]);

  const handleFollowProject = async (projectId) => {
    try {
      await apiClient.post(`/mentor/projects/${projectId}/follow`);
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === projectId ? { ...project, isFollowed: true } : project
        )
      );
      setRecommendedProjects(prevRecommendedProjects =>
        prevRecommendedProjects.map(project =>
          project._id === projectId ? { ...project, isFollowed: true } : project
        )
      );
      alert('Project followed successfully!');
    } catch (err) {
      console.error("Error following project:", err);
      alert('Failed to follow project.');
    }
  };

  const handleUnfollowProject = async (projectId) => {
    try {
      await apiClient.delete(`/mentor/projects/${projectId}/follow`);
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === projectId ? { ...project, isFollowed: false } : project
        )
      );
      setRecommendedProjects(prevRecommendedProjects =>
        prevRecommendedProjects.map(project =>
          project._id === projectId ? { ...project, isFollowed: false } : project
        )
      );
      alert('Project unfollowed successfully!');
    } catch (err) {
      console.error("Error unfollowing project:", err);
      alert('Failed to unfollow project.');
    }
  };

  if (loading || loadingRecommendations) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-10 w-64 mb-6" /> {/* Skeleton for title */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full" /> {/* Skeleton for search input */}
          <Skeleton className="h-10 w-full" /> {/* Skeleton for category select */}
          <Skeleton className="h-10 w-full" /> {/* Skeleton for skill select */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-4 flex justify-between items-center">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || recommendationError) {
    return <div className="text-center py-8 text-red-500">{error || recommendationError}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Browse Projects</h1>

      {recommendedProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recommended Projects for You</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendedProjects.map((project) => (
              <Card key={project._id} className="border-2 border-blue-500 shadow-lg">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <p className="text-sm text-gray-600">Creator: {project.creator ? project.creator.name : 'Unknown'}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-2 line-clamp-3">{project.description}</p>
                  <p className="text-sm text-gray-500">Category: {project.category}</p>
                  <p className="text-sm text-gray-500">Tech Stack: {project.techStack && Array.isArray(project.techStack) ? project.techStack.join(', ') : 'None'}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <Link to={`/mentor/projects/${project._id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    {project.isFollowed ? (
                      <Button onClick={() => handleUnfollowProject(project._id)} variant="destructive">
                        Unfollow Project
                      </Button>
                    ) : (
                      <Button onClick={() => handleFollowProject(project._id)} variant="default">
                        Follow Project
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <hr className="my-8 border-t-2 border-gray-200" />
        </div>
      )}

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
            <SelectItem value="all">All Categories</SelectItem>
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
            <SelectItem value="all">All Skills</SelectItem>
            {availableSkills.map((skill) => (
              <SelectItem key={skill} value={skill}>{skill}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No projects found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <p className="text-sm text-gray-600">Creator: {project.creator ? project.creator.name : 'Unknown'}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2 line-clamp-3">{project.description}</p>
                <p className="text-sm text-gray-500">Category: {project.category}</p>
                <p className="text-sm text-gray-500">Tech Stack: {project.techStack && Array.isArray(project.techStack) ? project.techStack.join(', ') : 'None'}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Link to={`/mentor/projects/${project._id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                  {project.isFollowed ? (
                    <Button onClick={() => handleUnfollowProject(project._id)} variant="destructive">
                      Unfollow Project
                    </Button>
                  ) : (
                    <Button onClick={() => handleFollowProject(project._id)} variant="default">
                      Follow Project
                    </Button>
                  )}
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
