import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router'; // Import useParams and Link
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

function MentorProfile() {
  const { id } = useParams(); // Get user ID from URL
  const [profileData, setProfileData] = useState(null);
  const [mentorArticles, setMentorArticles] = useState([]); // New state for mentor's articles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProfileData, setEditProfileData] = useState(null);

  useEffect(() => {
    const getProfileAndArticles = async () => {
      try {
        const profileEndpoint = id ? `/users/${id}` : '/auth/profile';
        const profileResponse = await apiClient.get(profileEndpoint);
        setProfileData(profileResponse.data);
        setEditProfileData(profileResponse.data);

        // Fetch articles only if viewing another mentor's profile
        if (id) {
          const articlesResponse = await apiClient.get(`/mentor/articles/by-mentor/${id}`);
          setMentorArticles(articlesResponse.data);
        }
      } catch (error) {
        setError('Failed to fetch profile or articles.');
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfileAndArticles();
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

  const handleAreasOfExpertiseChange = (e) => {
    setEditProfileData(prevData => ({
      ...prevData,
      areasOfExpertise: e.target.value.split(',').map(area => area.trim()),
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
      formData.append('areasOfExpertise', editProfileData.areasOfExpertise);
      formData.append('yearsOfExperience', editProfileData.yearsOfExperience);
      formData.append('credentials', editProfileData.credentials);
      formData.append('bio', editProfileData.bio);

      if (editProfileData.photo && !editProfileData.photo.startsWith('http')) { // Only append if it's a new file
        formData.append('photo', editProfileData.photo);
      }

      await apiClient.put('/mentor/profile', formData, {
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
            {id ? "Mentor Profile" : "My Profile"}
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

  if (!profileData) {
    return <div className="p-4">No profile data found.</div>;
  }

  const isMyProfile = !id; // If no ID in URL, it's the current user's profile

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1 className="text-2xl font-semibold mb-4">
          {isMyProfile ? "My Profile" : "Mentor Profile"}
        </h1>

        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          <CardHeader className="flex flex-col md:flex-row items-center gap-4 p-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={profileData.photo ? (profileData.photo.startsWith('blob:') ? profileData.photo : `${API_URL}/${profileData.photo}`) : `https://ui-avatars.com/api/?name=${profileData.name}&background=random`} alt={profileData.name} />
              <AvatarFallback>{profileData.name ? profileData.name.charAt(0) : 'MN'}</AvatarFallback>
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
                      src={editProfileData.photo.startsWith('blob:') ? editProfileData.photo : `${API_URL}/${editProfileData.photo}`}
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
                  <Label htmlFor="areasOfExpertise">Areas of Expertise (Comma-separated):</Label>
                  <Input
                    type="text"
                    id="areasOfExpertise"
                    name="areasOfExpertise"
                    value={editProfileData.areasOfExpertise?.join(', ') || ''}
                    onChange={handleAreasOfExpertiseChange}
                  />
                </div>
                <div>
                  <Label htmlFor="yearsOfExperience">Years of Experience:</Label>
                  <Input type="text" id="yearsOfExperience" name="yearsOfExperience" value={editProfileData.yearsOfExperience || ''} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="credentials">Credentials:</Label>
                  <Input type="text" id="credentials" name="credentials" value={editProfileData.credentials || ''} onChange={handleChange} />
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
                    <p className="text-sm font-medium text-muted-foreground">Years of Experience</p>
                    <p className="text-lg">{profileData.yearsOfExperience || 'N/A'} years</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Areas of Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.areasOfExpertise && profileData.areasOfExpertise.length > 0 ? (
                      profileData.areasOfExpertise.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1 text-base">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-lg text-muted-foreground">No areas of expertise listed.</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credentials</p>
                  <p className="text-lg">{profileData.credentials || 'N/A'}</p>
                </div>
                {isMyProfile && (
                  <Button onClick={handleEditClick} className="w-fit">Edit Profile</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {!isMyProfile && mentorArticles.length > 0 && (
          <Card className="w-full max-w-3xl mx-auto shadow-lg mt-6">
            <CardHeader>
              <CardTitle>Articles by {profileData.name}</CardTitle>
              <CardDescription>Explore insights and knowledge shared by this mentor.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {mentorArticles.map((article) => (
                  <div key={article._id} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">Category: {article.category}</p>
                      <p className="text-sm text-muted-foreground">Published: {new Date(article.publicationDate).toLocaleDateString()}</p>
                    </div>
                    <Link to={`/articles/${article._id}`}>
                      <Button variant="outline" size="sm" className="mt-2 md:mt-0">Read Article</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

export default MentorProfile;
