import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router'; // Import useParams
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import apiClient from '@/lib/apiClient'; // Use apiClient directly
import { API_URL } from '@/lib/constant'; // Import API_URL

function CreatorProfile() {
  const { id } = useParams(); // Get user ID from URL
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProfileData, setEditProfileData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const endpoint = id ? `/users/${id}` : '/auth/profile'; // Adjust endpoint based on ID
        const response = await apiClient.get(endpoint);
        setProfileData(response.data);
        setEditProfileData(response.data); // Initialize edit data with fetched data
      } catch (error) {
        setError('Failed to fetch profile.'); // More generic error message
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [id]); // Re-fetch when ID changes

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setEditProfileData(profileData); // Revert changes
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    setEditProfileData(prevData => ({
      ...prevData,
      skills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProfileData({
        ...editProfileData,
        photo: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editProfileData.name);
      formData.append('email', editProfileData.email);
      formData.append('bio', editProfileData.bio);
      // Ensure skills are sent as a JSON string if they are an array
      if (Array.isArray(editProfileData.skills)) {
        formData.append('skills', JSON.stringify(editProfileData.skills));
      } else {
        formData.append('skills', editProfileData.skills || '');
      }

      if (editProfileData.photo && !editProfileData.photo.startsWith('http')) { // Only append if it's a new file
        formData.append('photo', editProfileData.photo);
      }

      await apiClient.put('/creator/profile', formData, { // Assuming this is the correct endpoint for creator profile updates
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileData(editProfileData); // Update displayed data
      setIsEditMode(false);
      console.log('Profile updated successfully.');
    } catch (error) {
      setError('Failed to update profile.');
      console.error("Failed to update profile:", error);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-lg h-full p-6">
          <h1 className="text-2xl font-semibold mb-4">
            {id ? "Creator Profile" : "My Profile"}
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

  if (!profileData) {
    return <div className="p-4">No profile data found.</div>;
  }

  const isMyProfile = !id; // If no ID in URL, it's the current user's profile

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">
          {isMyProfile ? "My Profile" : "Creator Profile"}
        </h1>

        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          <CardHeader className="flex flex-col md:flex-row items-center gap-4 p-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={profileData.photo ? (profileData.photo.startsWith('blob:') ? profileData.photo : `${API_URL}/uploads/${profileData.photo}`) : `https://ui-avatars.com/api/?name=${profileData.name}&background=random`} alt={profileData.name} />
              <AvatarFallback>{profileData.name ? profileData.name.charAt(0) : 'CR'}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="text-3xl font-bold">{profileData.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {profileData.bio || "No bio provided."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {isEditMode && isMyProfile ? (
              <form onSubmit={handleSubmit} className="grid gap-6">
                <div>
                  <Label htmlFor="name">Full Name:</Label>
                  <Input type="text" id="name" name="name" value={editProfileData.name || ''} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="photo">Profile Photo:</Label>
                  <Input
                    id="photo"
                    type="file"
                    onChange={handlePhotoChange}
                  />
                  {editProfileData.photo && (
                    <img
                      src={editProfileData.photo.startsWith('blob:') ? editProfileData.photo : `${API_URL}/uploads/${editProfileData.photo}`}
                      alt="Profile Preview"
                      className="mt-2 h-20 w-20 rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address:</Label>
                  <Input type="email" id="email" name="email" value={editProfileData.email || ''} onChange={handleChange} disabled />
                </div>
                <div>
                  <Label htmlFor="skills">Skills/Expertise (comma-separated):</Label>
                  <Textarea
                    id="skills"
                    name="skills"
                    value={Array.isArray(editProfileData.skills) ? editProfileData.skills.join(', ') : editProfileData.skills || ''}
                    onChange={handleSkillsChange}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio:</Label>
                  <Textarea id="bio" name="bio" value={editProfileData.bio || ''} onChange={handleChange} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={handleCancelClick}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            ) : (
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p className="text-lg">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                    <p className="text-lg">{new Date(profileData.lastLogin).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Skills/Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills && profileData.skills.length > 0 ? (
                      profileData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1 text-base">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-lg text-muted-foreground">No skills/expertise listed.</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bio</p>
                  <p className="text-lg">{profileData.bio || 'N/A'}</p>
                </div>
                {isMyProfile && (
                  <Button onClick={handleEditClick} className="w-fit">Edit Profile</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default CreatorProfile;
