import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from '@/lib/apiClient'; // Assuming an API client
import { API_URL } from '@/lib/constant';

function CollaboratorProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for now
  const dummyProfile = {
    name: 'Collaborator User',
    photo: 'profile.jpg', // Placeholder for photo URL
    contactNumber: '123-456-7890',
    email: 'collaborator@example.com',
    skills: ['React', 'Node.js', 'MongoDB'],
    portfolioLinks: ['https://github.com/collaborator', 'https://linkedin.com/in/collaborator'],
    bio: 'Experienced collaborator ready to contribute to exciting projects.',
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/collaborator/profile');
        setProfile(response.data);
        setEditedProfile(response.data); // Initialize edited state
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // If cancelling, revert changes
    if (isEditing) {
      setEditedProfile(profile);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [id]: value,
    });
  };

  const handleSkillsChange = (e) => {
    // Basic comma-separated handling for now
    setEditedProfile({
      ...editedProfile,
      skills: e.target.value.split(',').map(skill => skill.trim()),
    });
  };

  const handlePortfolioLinksChange = (e) => {
    // Basic comma-separated handling for now
    setEditedProfile({
      ...editedProfile,
      portfolioLinks: e.target.value.split(',').map(link => link.trim()),
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProfile({
        ...editedProfile,
        photo: URL.createObjectURL(file), // Store the URL for preview
      });
    }
  };


  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editedProfile.name);
      formData.append('contactNumber', editedProfile.contactNumber);
      formData.append('skills', editedProfile.skills);
      formData.append('portfolioLinks', editedProfile.portfolioLinks);
      formData.append('bio', editedProfile.bio);

      if (editedProfile.photo) {
        formData.append('photo', editedProfile.photo);
      }

      await apiClient.put('/collaborator/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(editedProfile); // Update main state on success
      setIsEditing(false);
      console.log('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
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
                  <Skeleton className="h-20 w-20 rounded-full object-cover mb-2" />
                </div>
                <div>
                  <Skeleton className="h-5 w-1/2 mb-1" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-1/2 mb-1" />
                  <Skeleton className="h-10 w-full" />
                </div>
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

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className=""> 
            {isEditing ? (
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Full Name:</Label>
                  <Input
                    id="name"
                    type="text"
                    value={editedProfile.name}
                    onChange={handleInputChange}
                  />
                </div>
                 <div>
                  <Label htmlFor="photo">Profile Photo:</Label>
                  <Input
                    id="photo"
                    type="file"
                    onChange={handlePhotoChange}
                  />
                  {editedProfile.photo && (
                    <img
                      src={editedProfile.photo.startsWith('blob:') ? editedProfile.photo : `http://localhost:3000/uploads/${editedProfile.photo}`}
                      alt="Profile Preview"
                      className="mt-2 h-20 w-20 rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="contactNumber">Contact Number:</Label>
                  <Input
                    id="contactNumber"
                    type="text"
                    value={editedProfile.contactNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address:</Label>
                   {/* Email is typically not editable or requires a different verification process */}
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    disabled // Disable email editing for now
                  />
                </div>
                <div>
                  <Label htmlFor="skills">Skills (Comma-separated):</Label>
                  <Input
                    id="skills"
                    type="text"
                    value={editedProfile.skills.join(', ')}
                    onChange={handleSkillsChange}
                  />
                </div>
                <div>
                  <Label htmlFor="portfolioLinks">Portfolio Links (Comma-separated URLs):</Label>
                  <Input
                    id="portfolioLinks"
                    type="text"
                    value={editedProfile.portfolioLinks.join(', ')}
                    onChange={handlePortfolioLinksChange}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio:</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={editedProfile.bio}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleUpdateProfile}>Update</Button>
                  <Button variant="outline" onClick={handleEditToggle}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <div>
                  <p><strong>Name:</strong> {profile?.name}</p>
                </div>
                 <div>
                  {profile?.photo && (
                    <img
                      src={profile.photo.startsWith('blob:') ? profile.photo : `${API_URL}/uploads/${profile.photo}`}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p><strong>Contact Number:</strong> {profile?.contactNumber}</p>
                </div>
                <div>
                  <p><strong>Email Address:</strong> {profile?.email}</p>
                </div>
                <div>
                  <p><strong>Skills:</strong> {profile?.skills?.join(', ')}</p>
                </div>
                <div>
                  <p><strong>Portfolio Links:</strong> {profile?.portfolioLinks?.join(', ')}</p>
                </div>
                <div>
                  <p><strong>Bio:</strong> {profile?.bio}</p>
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

export default CollaboratorProfile;
