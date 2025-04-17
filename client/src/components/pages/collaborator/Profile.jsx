import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

function CollaboratorProfile() {
  const profileData = {
    name: "Peter Jones",
    email: "peter.jones@example.com",
    username: "peterjones",
    skills: ["HTML", "CSS", "JavaScript"],
    portfolio: "https://example.com/portfolio",
    bio: "Frontend developer with a passion for creating user-friendly web experiences.",
  };

  return (
    <div className="container mx-auto flex justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">Collaborator Profile</CardTitle>
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
            <Label className="text-lg font-bold" htmlFor="skills">Skills</Label>
            <div className="flex gap-1">
              {profileData.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-lg font-bold" htmlFor="portfolio">Portfolio Links</Label>
            <p className="text-gray-500">
              <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer">
                My Portfolio
              </a>
            </p>
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

export default CollaboratorProfile;