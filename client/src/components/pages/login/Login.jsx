import React from 'react';
import { Link } from 'react-router';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login Expired</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-center text-gray-600">Your login has expired. Please log in again as one of the following:</p>
          <div className="flex flex-col space-y-2">
            {/* <Button variant="outline" asChild><Link to="/login/admin">Admin</Link></Button> */}
            <Button variant="outline" asChild><Link to="/login/creator">Creator</Link></Button>
            <Button variant="outline" asChild><Link to="/login/collaborator">Collaborator</Link></Button>
            <Button variant="outline" asChild><Link to="/login/mentor">Mentor</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;