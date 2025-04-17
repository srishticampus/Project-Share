import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

function CreatorProfile() {
  const profileData = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    username: "janesmith",
    skills: ["JavaScript", "React", "Node.js"],
    bio: "Experienced web developer with a passion for building innovative applications.",
  };

  return (
    <div className="container mx-auto flex justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">Project Creator Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label className="text-lg font-bold" htmlFor="name">Full Name</Label>
            <p className="text-gray-500">{profileData.name}</p>
          </div>
          <div>
            <Label className="text-lg font-bold" htmlFor="email">Email Address</Label>
            <p className="text-gray-500">{profileData.email}</p>
          </div>
          <div>
            <Label className="text-lg font-bold" htmlFor="username">Username</Label>
            <p className="text-gray-500">{profileData.username}</p>
          </div>
          <div>
            <Label className="text-lg font-bold" htmlFor="skills">Skills/Expertise</Label>
            <div className="flex gap-1">
              {profileData.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-lg font-bold" htmlFor="bio">Bio</Label>
            <p className="text-gray-500">{profileData.bio}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreatorProfile;