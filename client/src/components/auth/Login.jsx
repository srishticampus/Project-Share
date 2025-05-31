import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from "@/components/ui/button"; // Assuming alias setup in vite/jsconfig
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import apiClient from '@/lib/apiClient'; // Import the configured axios instance

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);

    try {
      // Use apiClient.post - baseURL and Content-Type are handled automatically
      const response = await apiClient.post('/auth/login', { email, password });

      // Axios provides data directly in response.data
      const data = response.data;

      // Login successful
      console.log('Login successful:', data);
      // Store the token and role in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role); // Store the user's role

      // Dispatch a custom event to notify other components of login status change
      window.dispatchEvent(new Event('loginStatusChange'));

      // Redirect user to dashboard or appropriate page
      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'creator') {
        navigate('/creator/dashboard'); // Assuming creator dashboard is /creator/dashboard
      } else if (data.role === 'collaborator') {
        navigate('/collaborator/dashboard'); // Assuming collaborator dashboard is /collaborator/dashboard
      } else if (data.role === 'mentor') {
        navigate('/mentor');
      } else {
        navigate('/home'); // Default redirect
      }

      // For now, just log success and clear form
       setEmail('');
       setPassword('');


    } catch (err) {
      console.error('Login error:', err);
      // Axios errors often have response data with backend messages
      const errorMsg = err.response?.data?.errors
        ? err.response.data.errors.map(e => e.msg).join(', ')
        : err.response?.data?.message || err.message || 'An error occurred during login.';
      
      // Check for the specific approval pending message
      if (err.response?.status === 403 && errorMsg.includes('Your account is pending admin approval.')) {
        setError('Login failed: Your account is pending admin approval. Please wait for an administrator to approve your account.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                {/* @TODO: Add Show/Hide password toggle */}
                {/* @TODO: Add "Forgot Password?" link */}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {/* @TODO: Add "Register Now" link */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Login;
