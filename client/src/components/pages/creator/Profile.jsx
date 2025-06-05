import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchUserProfile, updateUserProfile } from '@/services/userService';

function CreatorProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProfileData, setEditProfileData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfileData(data);
        setEditProfileData(data); // Initialize edit data with fetched data
      } catch (error) {
        setError(error);
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = { ...editProfileData };
      if (dataToUpdate.skills && typeof dataToUpdate.skills === 'string') {
        dataToUpdate.skills = dataToUpdate.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
      }
      await updateUserProfile(dataToUpdate);
      setProfileData(dataToUpdate); // Update displayed data
      setIsEditMode(false);
    } catch (error) {
      setError(error);
      console.error("Failed to update profile:", error);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error.message}</div>;
  }

  if (!profileData) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className="container mx-auto flex justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">Project Creator Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isEditMode ? (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <Label className="text-lg font-bold" htmlFor="name">Full Name</Label>
                <Input type="text" id="name" name="name" value={editProfileData.name || ''} onChange={handleChange} />
              </div>
              <div>
                <Label className="text-lg font-bold" htmlFor="email">Email Address</Label>
                <Input type="email" id="email" name="email" value={editProfileData.email || ''} onChange={handleChange} />
              </div>
              <div>
                <Label className="text-lg font-bold" htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" value={editProfileData.bio || ''} onChange={handleChange} />
              </div>
              <div>
                <Label className="text-lg font-bold" htmlFor="skills">Skills/Expertise (comma-separated)</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  value={Array.isArray(editProfileData.skills) ? editProfileData.skills.join(', ') : editProfileData.skills || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" type="button" onClick={handleCancelClick}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <Label className="text-lg font-bold" htmlFor="name">Full Name</Label>
                <p className="text-gray-500">{profileData.name}</p>
              </div>
              <div>
                <Label className="text-lg font-bold" htmlFor="email">Email Address</Label>
                <p className="text-gray-500">{profileData.email}</p>
              </div>
              <div>
                <Label className="text-lg font-bold" htmlFor="skills">Skills/Expertise</Label>
                <div className="flex gap-1">
                  {profileData.skills && profileData.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-lg font-bold" htmlFor="lastLogin">Last Login</Label>
                <p className="text-gray-500">{new Date(profileData.lastLogin).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-lg font-bold" htmlFor="bio">Bio</Label>
                <p className="text-gray-500">{profileData.bio}</p>
              </div>
              <Button onClick={handleEditClick}>Edit Profile</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CreatorProfile;
