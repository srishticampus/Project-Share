import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient'; // Assuming an API client

function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPortfolio, setEditedPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for now
  const dummyPortfolio = {
    skillsShowcase: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    portfolioLinks: ['https://github.com/collaborator', 'https://linkedin.com/in/collaborator'],
    bio: 'Experienced full-stack developer with a passion for building scalable web applications.',
    projects: [ // Assuming this lists completed projects marked for portfolio
      { _id: 'comp1', title: 'Build a Personal Website' },
      { _id: 'comp2', title: 'E-commerce Platform Development' },
    ],
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await apiClient.get('/collaborator/portfolio');
        setPortfolio(response.data);
        setEditedPortfolio(response.data); // Initialize edited state
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setError('Failed to fetch portfolio.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();

  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // If cancelling, revert changes
    if (isEditing) {
      setEditedPortfolio(portfolio);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedPortfolio({
      ...editedPortfolio,
      [id]: value,
    });
  };

  const handleSkillsChange = (e) => {
    // Basic comma-separated handling for now
    setEditedPortfolio({
      ...editedPortfolio,
      skillsShowcase: e.target.value.split(',').map(skill => skill.trim()),
    });
  };

  const handlePortfolioLinksChange = (e) => {
    // Basic comma-separated handling for now
    setEditedPortfolio({
      ...editedPortfolio,
      portfolioLinks: e.target.value.split(',').map(link => link.trim()),
    });
  };


  const handleUpdatePortfolio = async () => {
    try {
      await apiClient.put('/collaborator/portfolio', editedPortfolio);
      setPortfolio(editedPortfolio); // Update main state on success
      setIsEditing(false);
      console.log('Portfolio updated successfully.');
    } catch (error) {
      console.error('Error updating portfolio:', error);
      setError('Failed to update portfolio.');
    }
  };

  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <h1 className="text-2xl font-semibold mb-4">My Portfolio</h1>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Skeleton className="h-5 w-1/2 mb-1" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-1/2 mb-1" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-1/4 mb-1" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-10 w-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!portfolio) {
    return <div>Portfolio not found.</div>;
  }

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">My Portfolio</h1>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid gap-4">
                 <div>
                  <Label htmlFor="skillsShowcase">Skills Showcase (Comma-separated):</Label>
                  <Input
                    id="skillsShowcase"
                    type="text"
                    value={editedPortfolio.skillsShowcase.join(', ')}
                    onChange={handleSkillsChange}
                  />
                </div>
                <div>
                  <Label htmlFor="portfolioLinks">Portfolio Links (Comma-separated URLs):</Label>
                  <Input
                    id="portfolioLinks"
                    type="text"
                    value={editedPortfolio.portfolioLinks.join(', ')}
                    onChange={handlePortfolioLinksChange}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio:</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={editedPortfolio.bio}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleUpdatePortfolio}>Update</Button>
                  <Button variant="outline" onClick={handleEditToggle}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <div>
                  <p><strong>Skills Showcase:</strong> {portfolio.skillsShowcase.join(', ')}</p>
                </div>
                <div>
                  <p><strong>Portfolio Links:</strong> {portfolio.portfolioLinks.join(', ')}</p>
                </div>
                <div>
                  <p><strong>Bio:</strong> {portfolio.bio}</p>
                </div>
                <div>
                  <p><strong>Completed Projects:</strong></p>
                  {portfolio.projects && portfolio.projects.length > 0 ? (
                    <ul>
                      {portfolio.projects.map(project => (
                        <li key={project._id}>
                          <strong>{project.title}</strong>
                          {project.myContributions && (
                            <p className="text-sm text-gray-600 ml-4">
                              My Contributions: {project.myContributions}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No completed projects added to portfolio.</p>
                  )}
                </div>
                <Button onClick={handleEditToggle}>Edit</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Portfolio;
