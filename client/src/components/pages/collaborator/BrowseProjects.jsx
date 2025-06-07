import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient';
import recommendationService from '@/services/recommendationService'; // Import recommendation service

function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]); // New state for recommended projects
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSkills, setFilterSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true); // New loading state for recommended projects

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/collaborator/projects', {
          params: { searchTerm, category: filterCategory, skills: filterSkills.join(',') }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendedProjects = async () => {
      setLoadingRecommended(true);
      try {
        const response = await recommendationService.getRecommendedProjects();
        setRecommendedProjects(response);
      } catch (error) {
        console.error('Error fetching recommended projects:', error);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchAllProjects();
    fetchRecommendedProjects(); // Fetch recommended projects on component mount

  }, [searchTerm, filterCategory, filterSkills]);

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">Recommended Projects for You</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {loadingRecommended ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={`rec-skeleton-${index}`}>
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
          ) : recommendedProjects.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No recommended projects at this time.</p>
          ) : (
            recommendedProjects.map((project) => (
              <Card key={project._id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Creator:</strong> {project.creator ? project.creator.name : 'N/A'}</p>
                  <p><strong>Description:</strong> {project.description}</p>
                  <p><strong>Tech Stack:</strong> {project?.techStack?.join(', ')}</p>
                  <p><strong>Recommendation Score:</strong> {project.recommendationScore ? project.recommendationScore.toFixed(2) : 'N/A'}</p>
                  <Link to={`/collaborator/projects/${project._id}`}>
                    <Button className="mt-4">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <h1 className="text-2xl font-semibold mb-4">Browse All Projects</h1>

        <div className="flex space-x-4 mb-6">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={`browse-skeleton-${index}`}>
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
            projects.map((project) => (
              <Card key={project._id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Creator:</strong> {project.creator ? project.creator.name : 'N/A'}</p>
                  <p><strong>Description:</strong> {project.description}</p>
                  <p><strong>Tech Stack:</strong> {project?.techStack?.join(', ')}</p>
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
