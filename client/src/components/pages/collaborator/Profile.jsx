import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import apiClient from '@/lib/apiClient';
import { API_URL } from '@/lib/constant';
import Portfolio from './Portfolio'; // Import the Portfolio component

function CollaboratorProfile() {
  const { id } = useParams(); // Get user ID from URL
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = id ? `/collaborator/profile/${id}` : '/collaborator/profile';
        const response = await apiClient.get(endpoint);
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]); // Re-fetch when ID changes

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
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
    setEditedProfile({
      ...editedProfile,
      skills: e.target.value.split(',').map(skill => skill.trim()),
    });
  };

  const handlePortfolioLinksChange = (e) => {
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
        photo: URL.createObjectURL(file),
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

      setProfile(editedProfile);
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
          <h1 className="text-2xl font-semibold mb-4">
            {id ? "Collaborator Profile" : "My Profile"}
          </h1>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-5 w-1/2 mb-1" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-5 w-1/2 mb-1" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-5 w-1/2 mb-1" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-5 w-1/4 mb-1" />
                <Skeleton className="h-20 w-full" />
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

  if (!profile) {
    return <div className="p-4">Profile not found.</div>;
  }

  const isMyProfile = !id; // If no ID in URL, it's the current user's profile

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">
          {isMyProfile ? "My Profile" : "Collaborator Profile"}
        </h1>

        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          <CardHeader className="flex flex-col md:flex-row items-center gap-4 p-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={profile.photo ? (profile.photo.startsWith('blob:') ? profile.photo : `${API_URL}/${profile.photo}`) : `https://ui-avatars.com/api/?name=${profile.name}&background=random`} alt={profile.name} />
              <AvatarFallback>{profile.name ? profile.name.charAt(0) : 'CN'}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="text-3xl font-bold">{profile.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {profile.bio || "No bio provided."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {isEditing && isMyProfile ? (
              <div className="grid gap-6">
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
                      src={editedProfile.photo.startsWith('blob:') ? editedProfile.photo : `${API_URL}/${editedProfile.photo}`}
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
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    disabled
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
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                    <p className="text-lg">{profile.contactNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p className="text-lg">{profile.email || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1 text-base">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-lg text-muted-foreground">No skills listed.</p>
                    )}
                  </div>
                </div>

                {isMyProfile && (
                  <Button onClick={handleEditToggle} className="w-fit">Edit Profile</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Render the Portfolio component below the profile card */}
        <div className="mt-6">
          <Portfolio collaboratorId={id} />
        </div>
      </div>
    </main>
  );
}

export default CollaboratorProfile;
