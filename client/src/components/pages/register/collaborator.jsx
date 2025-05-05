import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from '@/lib/apiClient'; // Import the configured axios instance

const CollaboratorRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true); // Set loading true

    try {
      console.log("Registration attempt:", { name, email, password });
      // Use apiClient.post - baseURL, Content-Type, and token (if exists) are handled
      const response = await apiClient.post("/auth/register/collaborator", { name, email, password });

      // Axios provides data directly in response.data
      const data = response.data;
      console.log("Registration successful:", data);

      // Check if a token is returned and store it
      if (data.token) {
        localStorage.setItem("token", data.token);
        // Redirect to collaborator dashboard after storing token
        navigate("/collaborator/dashboard"); // Using navigate from react-router
      } else {
        // Handle case where registration is successful but no token is returned (optional)
        console.warn("Registration successful, but no token received.");
        // Decide if navigation should still happen or show an error/message
        setError("Registration complete, but login might be required.");
        // Or navigate to login page: navigate("/login/collaborator");
      }
    } catch (err) {
      console.error("Registration error:", err);
      // Use Axios error structure for more specific messages
      const errorMsg = err.response && err.response.data && err.response.data.errors && err.response.data.errors[0] && err.response.data.errors[0].msg ? err.response.data.errors[0].msg : err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message || "An unexpected error occurred.";
      setError(errorMsg);
    } finally {
      setLoading(false); // Set loading false
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Collaborator Registration</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Centered error */}
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading} // Disable input when loading
            />
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading} // Disable input when loading
            />
          </div>
          {/* Removed Username Input Field */}
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading} // Disable input when loading
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading} // Disable input when loading
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'} {/* Show loading text */}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login/collaborator" className="text-sm text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorRegister;