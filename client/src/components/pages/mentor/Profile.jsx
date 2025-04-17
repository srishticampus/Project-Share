import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

function MentorProfile() {
  const profileData = {
    name: "Alice Brown",
    email: "alice.brown@example.com",
    username: "alicebrown",
    expertise: ["Web Development", "Machine Learning", "Data Science"],
    experience: "10+",
    credentials: "Ph.D. in Computer Science, Certified Mentor",
    bio: "Experienced mentor and expert in various fields, passionate about helping others succeed.",
  };

  return (
    <div className="container mx-auto flex justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">Mentor/Expert Profile</CardTitle>
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
            <Label className="text-lg font-bold" htmlFor="expertise">Areas of Expertise</Label>
            <div className="flex gap-1">
              {profileData.expertise.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-lg font-bold" htmlFor="experience">Years of Experience</Label>
            <p className="text-gray-500">{profileData.experience}</p>
          </div>
          <div>
            <Label className="text-lg font-bold" htmlFor="credentials">Credentials</Label>
            <p className="text-gray-500">{profileData.credentials}</p>
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

export default MentorProfile;