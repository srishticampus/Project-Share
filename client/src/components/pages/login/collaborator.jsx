import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from '@/lib/apiClient'; // Import the configured axios instance

const CollaboratorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading true

    try {
      console.log("Login attempt:", { email, password });
      // Use apiClient.post - baseURL, Content-Type, and token (if exists) are handled
      const response = await apiClient.post("/auth/login", { email, password });

      // Axios provides data directly in response.data
      const data = response.data;
      console.log("Login successful:", data);

      // Assuming the server returns a token in the response data
      if (data.token) {
        // Store the token in local storage
        localStorage.setItem("token", data.token);

        // Fetch user profile to get the role
        const profileResponse = await apiClient.get('/auth/profile');
        const profileData = profileResponse.data;
        const userRole = profileData.role; // Assuming the role is in profileData.role

        localStorage.setItem('role', userRole);

        // Check if the user's role matches the expected role for this login page
        if (userRole !== 'collaborator') {
          setError("Unauthorized: Your registered role is not Collaborator.");
          localStorage.removeItem("token"); // Clear token if role mismatch
          localStorage.removeItem("role"); // Clear role if role mismatch
          setLoading(false); // Ensure loading is false
          return; // Stop further execution
        }

        // Dispatch a custom event to notify other components of login status change
        window.dispatchEvent(new Event('loginStatusChange'));

        // Redirect to the collaborator dashboard
        // Consider using useNavigate from react-router for SPA navigation
        navigate('/collaborator/dashboard');
      } else {
        // This case might not be necessary if the server always returns a token on success
        // or throws an error handled by the catch block.
        setError("Login successful, but token not received.");
      }
    } catch (err) {
      console.error("Login error:", err);
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
        <h2 className="text-2xl font-semibold text-center mb-4">Collaborator Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Centered error */}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading} // Disable input when loading
            />
          </div>
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} {/* Show loading text */}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login/forgot-password" className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="text-center mt-4">
          <Link to="/register/collaborator" className="text-sm text-blue-500 hover:underline">
            New to ProjectShare? Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorLogin;
