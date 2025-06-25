import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient';

function Portfolio({ collaboratorId }) { // Accept collaboratorId as a prop
  const [portfolio, setPortfolio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPortfolio, setEditedPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const endpoint = collaboratorId ? `/collaborator/portfolio/${collaboratorId}` : '/collaborator/portfolio';
        const response = await apiClient.get(endpoint);
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
  }, [collaboratorId]); // Re-fetch when collaboratorId changes

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
    setEditedPortfolio({
      ...editedPortfolio,
      skillsShowcase: e.target.value.split(',').map(skill => skill.trim()),
    });
  };

  const handlePortfolioLinksChange = (e) => {
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

  const isMyPortfolio = !collaboratorId; // If no ID, it's the current user's portfolio

  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <h1 className="text-2xl font-semibold mb-4">{isMyPortfolio ? "My Portfolio" : "Collaborator Portfolio"}</h1>
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
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!portfolio) {
    return <div className="p-4">Portfolio not found.</div>;
  }

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">{isMyPortfolio ? "My Portfolio" : "Collaborator Portfolio"}</h1>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing && isMyPortfolio ? ( // Only allow editing if it's "My Portfolio"
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
                  <p className="text-sm font-medium text-muted-foreground">Skills Showcase</p>
                  <p className="text-lg">{portfolio.skillsShowcase && portfolio.skillsShowcase.length > 0 ? portfolio.skillsShowcase.join(', ') : 'No skills listed.'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio Links</p>
                  <div className="space-y-2">
                    {portfolio.portfolioLinks && portfolio.portfolioLinks.length > 0 ? (
                      portfolio.portfolioLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-2 text-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                          {link}
                        </a>
                      ))
                    ) : (
                      <p className="text-lg text-muted-foreground">No portfolio links provided.</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bio</p>
                  <p className="text-lg">{portfolio.bio || "No bio provided."}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Completed Projects</p>
                  {portfolio.projects && portfolio.projects.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {portfolio.projects.map(project => (
                        <li key={project._id}>
                          <strong className="text-lg">{project.title}</strong>
                          {project.myContributions && (
                            <p className="text-sm text-gray-600 ml-4">
                              My Contributions: {project.myContributions}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-muted-foreground">No completed projects added to portfolio.</p>
                  )}
                </div>
                {isMyPortfolio && ( // Only show edit button if it's "My Portfolio"
                  <Button onClick={handleEditToggle}>Edit</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Portfolio;
