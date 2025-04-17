import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ResetPassword = () => {
  return (
    <div className="container mx-auto flex items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
        <form className="space-y-6">
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </Label>
            <Input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your new password"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Confirm your new password"
            />
          </div>
          <Button type="submit" className="w-full">
            Update Password
          </Button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login/admin" className="text-sm text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;