import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import apiClient from '@/lib/apiClient';
import recommendationService from '@/services/recommendationService'; // Import recommendation service
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

function ConnectWithMentors() {
  const [mentors, setMentors] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]); // New state for recommended mentors
  const [loading, setLoading] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true); // New loading state for recommended mentors
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [sentMentorshipRequests, setSentMentorshipRequests] = useState([]); // New state for sent requests

  useEffect(() => {
    const fetchAllMentors = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/users/mentors');
        setMentors(response.data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setError("Failed to load mentors.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendedMentors = async () => {
      setLoadingRecommended(true);
      try {
        const response = await recommendationService.getRecommendedMentors();
        setRecommendedMentors(response);
      } catch (err) {
        console.error("Error fetching recommended mentors:", err);
      } finally {
        setLoadingRecommended(false);
      }
    };

    const fetchSentMentorshipRequests = async () => {
      try {
        const response = await apiClient.get('/mentor/mentorship-requests/sent');
        // Extract mentor IDs from the sent requests
        const sentMentorIds = response.data.map(request => request.mentor._id);
        setSentMentorshipRequests(sentMentorIds);
      } catch (err) {
        console.error("Error fetching sent mentorship requests:", err);
      }
    };

    fetchAllMentors();
    fetchRecommendedMentors();
    fetchSentMentorshipRequests(); // Fetch sent requests
  }, []);

  const handleRequestMentorshipClick = (mentor) => {
    setSelectedMentor(mentor);
    setIsDialogOpen(true);
  };

  const handleSendRequest = async () => {
    if (!selectedMentor || !message.trim()) {
      setError("Please select a mentor and provide a message.");
      return;
    }

    setSendingRequest(true);
    setError(null);

    try {
      await apiClient.post('/mentor/mentorship-requests', {
        mentor: selectedMentor._id,
        message: message.trim(),
      });
      alert('Mentorship request sent successfully!');
      setIsDialogOpen(false);
      setMessage('');
      setSelectedMentor(null);
      // Add the newly requested mentor's ID to the sentMentorshipRequests state
      setSentMentorshipRequests(prev => [...prev, selectedMentor._id]);
    } catch (err) {
      console.error("Error sending mentorship request:", err);
      setError("Failed to send mentorship request. Please try again.");
    } finally {
      setSendingRequest(false);
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mentor.areasOfExpertise && mentor.areasOfExpertise.some(area => area.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const isMentorRequested = (mentorId) => sentMentorshipRequests.includes(mentorId);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Recommended Mentors for You</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loadingRecommended ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={`rec-mentor-skeleton-${index}`}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-1/3 mb-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : recommendedMentors.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No recommended mentors at this time.</p>
        ) : (
          recommendedMentors.map((mentor) => (
            <Card key={mentor._id}>
              <CardHeader>
                <CardTitle>{mentor.name}</CardTitle>
                <p className="text-sm text-gray-600">Expertise: {mentor.areasOfExpertise ? mentor.areasOfExpertise.join(', ') : 'N/A'}</p>
                <p className="text-xs text-gray-500">Experience: {mentor.yearsOfExperience} years</p>
                <p className="text-xs text-gray-500">Score: {mentor.recommendationScore ? mentor.recommendationScore.toFixed(2) : 'N/A'}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2 line-clamp-3">{mentor.bio || 'No bio available.'}</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Link to={`/mentor/profile/${mentor._id}`}>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </Link>
                  <Button
                    onClick={() => handleRequestMentorshipClick(mentor)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    disabled={isMentorRequested(mentor._id)}
                  >
                    {isMentorRequested(mentor._id) ? 'Requested' : 'Request Mentorship'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <h1 className="text-3xl font-bold mb-6">Browse All Mentors</h1>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search mentors by name or expertise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading all mentors...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : filteredMentors.length === 0 ? (
        <p className="text-center text-gray-500">No mentors found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor._id}>
              <CardHeader>
                <CardTitle>{mentor.name}</CardTitle>
                <p className="text-sm text-gray-600">Expertise: {mentor.areasOfExpertise ? mentor.areasOfExpertise.join(', ') : 'N/A'}</p>
                <p className="text-xs text-gray-500">Experience: {mentor.yearsOfExperience} years</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2 line-clamp-3">{mentor.bio || 'No bio available.'}</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Link to={`/mentor/profile/${mentor._id}`}>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </Link>
                  <Button
                    onClick={() => handleRequestMentorshipClick(mentor)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    disabled={isMentorRequested(mentor._id)}
                  >
                    {isMentorRequested(mentor._id) ? 'Requested' : 'Request Mentorship'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Mentorship from {selectedMentor?.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="message" className="sr-only">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your mentorship request message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                required
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSendRequest} disabled={sendingRequest}>
                {sendingRequest ? 'Sending...' : 'Send Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ConnectWithMentors;
