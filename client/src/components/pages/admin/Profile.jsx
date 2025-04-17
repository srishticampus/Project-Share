import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

function AdminProfile() {
  const profileData = {
    name: "John Doe",
    email: "john.doe@example.com",
    username: "johndoe",
  };

  return (
    <div className="container mx-auto flex justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Profile</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminProfile;