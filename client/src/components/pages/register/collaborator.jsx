import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import apiClient from '@/lib/apiClient';

const CollaboratorRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [skills, setSkills] = useState(""); // TODO: Implement as multiselect
  const [portfolioLinks, setPortfolioLinks] = useState(""); // TODO: Implement to handle multiple links
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null); // State for photo file
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);

    // TODO: Handle photo upload and get URL/identifier
    // For now, sending other data

    try {
      console.log("Registration attempt:", { name, email, password, contactNumber, skills, portfolioLinks, bio, photo });
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('contactNumber', contactNumber);
      formData.append('skills', JSON.stringify(skills.split(',').map(skill => skill.trim()))); // Basic split for now
      formData.append('portfolioLinks', JSON.stringify(portfolioLinks.split(',').map(link => link.trim()))); // Basic split for now
      formData.append('bio', bio);
      if (photo) {
        formData.append('photo', photo);
      }

      const response = await apiClient.post("/auth/register/collaborator", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      console.log("Registration successful:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "collaborator"); // Set the role for collaborator
        window.dispatchEvent(new Event('loginStatusChange')); // Dispatch event
        navigate("/collaborator/dashboard");
      } else {
        console.warn("Registration successful, but no token received.");
        setError("Registration complete, wait for admin approval for login.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg = err.response && err.response.data && err.response.data.errors && err.response.data.errors[0] && err.response.data.errors[0].msg ? err.response.data.errors[0].msg : err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message || "An unexpected error occurred.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Collaborator Registration</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
            />
          </div>
          <div className="relative">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
              style={{ top: '28px' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <div className="relative">
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
              style={{ top: '28px' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
           <div>
            <Label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
              Contact Number
            </Label>
            <Input
              type="text"
              id="contactNumber"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your contact number"
              pattern="[0-9]{10}"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
           <div>
            <Label htmlFor="skills" className="block text-sm font-medium text-gray-700">
              Skills (Comma-separated)
            </Label>
            <Input
              type="text"
              id="skills"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your skills (e.g., React, Node.js)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
           <div>
            <Label htmlFor="portfolioLinks" className="block text-sm font-medium text-gray-700">
              Portfolio Links (Comma-separated URLs)
            </Label>
            <Input
              type="text"
              id="portfolioLinks"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your portfolio links (e.g., https://github.com/user, https://linkedin.com/in/user)"
              value={portfolioLinks}
              onChange={(e) => setPortfolioLinks(e.target.value)}
            />
          </div>
           <div>
            <Label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </Label>
            <Textarea
              id="bio"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
           <div>
            <Label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              Profile Photo
            </Label>
            <Input
              type="file"
              id="photo"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
           {loading ? 'Registering...' : 'Register'}
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
