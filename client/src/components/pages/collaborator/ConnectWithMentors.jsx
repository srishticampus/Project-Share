import React, { useState, useEffect } from 'react';
import { Link } from 'react-router'; // Import Link
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient';
import { Label } from '@/components/ui/label';

function ConnectWithMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await apiClient.get('/users/mentors'); // Reusing the generic endpoint for listing mentors
        setMentors(response.data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setError("Failed to load mentors.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
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
      // This API endpoint is handled by server/controllers/mentor/mentorRequestController.js
      // The requester will be the logged-in user (Project Creator or Collaborator)
      await apiClient.post('/mentor/mentorship-requests', {
        mentor: selectedMentor._id,
        message: message.trim(),
        // project field can be added if the request is tied to a specific project
      });
      alert('Mentorship request sent successfully!');
      setIsDialogOpen(false);
      setMessage('');
      setSelectedMentor(null);
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Connect with Mentors</h1>
        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => ( // Render 3 skeleton cards for mentors
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Connect with Mentors</h1>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search mentors by name or expertise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMentors.length === 0 ? (
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
                <div className="mt-4 flex flex-col sm:flex-row gap-2"> {/* Added flex for buttons */}
                  <Link to={`/mentor/profile/${mentor._id}`}>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </Link>
                  <Button onClick={() => handleRequestMentorshipClick(mentor)} className="bg-green-500 hover:bg-green-600 text-white">
                    Request Mentorship
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
