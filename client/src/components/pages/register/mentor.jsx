import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Added Textarea import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select imports
import apiClient from '@/lib/apiClient';

const MentorRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState(null); // Added photo state
  const [contactNumber, setContactNumber] = useState(""); // Added contactNumber state
  const [areasOfExpertise, setAreasOfExpertise] = useState([]); // Added areasOfExpertise state
  const [yearsOfExperience, setYearsOfExperience] = useState(""); // Added yearsOfExperience state
  const [credentials, setCredentials] = useState(""); // Added credentials state
  const [bio, setBio] = useState(""); // Added bio state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const expertiseOptions = [
    "Web Development", "Mobile Development", "UI/UX Design", "Data Science",
    "Machine Learning", "Cloud Computing", "Cybersecurity", "DevOps",
    "Project Management", "Marketing", "Content Creation", "Business Strategy"
  ];

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleExpertiseChange = (value) => {
    // Assuming 'value' is a single selected item from the Select component
    // For multiselect, you'd typically use a different UI component or handle multiple selections differently.
    // For now, I'll assume it's a single select or a placeholder for future multiselect.
    if (!areasOfExpertise.includes(value)) {
      setAreasOfExpertise([...areasOfExpertise, value]);
    } else {
      setAreasOfExpertise(areasOfExpertise.filter((item) => item !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (photo) formData.append("photo", photo);
    formData.append("contactNumber", contactNumber);
    formData.append("areasOfExpertise", JSON.stringify(areasOfExpertise)); // Send as JSON string
    formData.append("yearsOfExperience", yearsOfExperience);
    formData.append("credentials", credentials);
    formData.append("bio", bio);

    try {
      console.log("Registration attempt:", { name, email, password, contactNumber, areasOfExpertise, yearsOfExperience, credentials, bio });
      const response = await apiClient.post("/auth/register/mentor", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      console.log("Registration successful:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/mentor");
      } else {
        console.warn("Registration successful, but no token received.");
        setError("Registration complete, but login might be required.");
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
        <h2 className="text-2xl font-semibold text-center mb-4">Mentor/Expert Registration</h2>
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
              required
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
            />
          </div>
          <div>
            <Label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              Photo
            </Label>
            <Input
              type="file"
              id="photo"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={handlePhotoChange}
              accept="image/*"
            />
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
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="areasOfExpertise" className="block text-sm font-medium text-gray-700">
              Areas of Expertise
            </Label>
            <Select onValueChange={handleExpertiseChange} value={areasOfExpertise[areasOfExpertise.length - 1] || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select expertise areas" />
              </SelectTrigger>
              <SelectContent>
                {expertiseOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {areasOfExpertise.map((expertise) => (
                <span key={expertise} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {expertise}
                  <button
                    type="button"
                    onClick={() => setAreasOfExpertise(areasOfExpertise.filter((item) => item !== expertise))}
                    className="ml-1 text-blue-800 hover:text-blue-600"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
              Years of Experience
            </Label>
            <Input
              type="number"
              id="yearsOfExperience"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter years of experience"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="credentials" className="block text-sm font-medium text-gray-700">
              Credentials
            </Label>
            <Textarea
              id="credentials"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your credentials"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
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
          <Button type="submit" className="w-full" disabled={loading}>
           {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login/mentor" className="text-sm text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MentorRegister;
