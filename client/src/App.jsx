import React from 'react';
import { Route, Routes } from 'react-router';
import LandingPage from './components/pages/landing-page';
import Layout from './components/pages/layout';
import AdminLogin from './components/pages/login/admin';
import CreatorLogin from './components/pages/login/creator';
import CollaboratorLogin from './components/pages/login/collaborator';
import MentorLogin from './components/pages/login/mentor';
import AdminRegister from './components/pages/register/admin';
import CreatorRegister from './components/pages/register/creator';
import CollaboratorRegister from './components/pages/register/collaborator';
import MentorRegister from './components/pages/register/mentor';
import ForgotPassword from './components/pages/login/ForgotPassword';
import ResetPassword from './components/pages/login/ResetPassword';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Features from './components/pages/Features';
import Contact from './components/pages/Contact';
import NotFound from './components/pages/NotFound';
import AdminLayout from './components/pages/admin/AdminLayout';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import MentorRequests from './components/pages/admin/MentorRequests';
import ProjectsPage from './components/pages/admin/Projects';
import Users from './components/pages/admin/Users';
import ContentModeration from './components/pages/admin/ContentModeration';
import Analytics from './components/pages/admin/Analytics';
import CreatorDashboardPage from './components/pages/creator/CreatorDashboardPage';
import CreatorLayout from './components/pages/creator/CreatorLayout';
import ProjectManagement from './components/pages/creator/ProjectManagement'; // Import the new component
import CollaboratorDashboardPage from './components/pages/collaborator/CollaboratorDashboardPage';
import MentorDashboardPage from './components/pages/mentor/MentorDashboardPage';
import AdminProfile from './components/pages/admin/Profile';
import CreatorProfile from './components/pages/creator/Profile';
import CollaboratorProfile from './components/pages/collaborator/Profile';
import MentorProfile from './components/pages/mentor/Profile';
import CollaboratorLayout from './components/pages/collaborator/CollaboratorLayout';
import MentorLayout from './components/pages/mentor/MentorLayout';
import CreatorTasks from './components/pages/creator/CreatorTasks';
import Login from './components/pages/login/Login';

function Projects() {
  return <div>Projects Page</div>;
}

function Collaborators() {
  return <div>Collaborators Page</div>;
}

function Register() {
  return <div>Register Page</div>;
}

function Terms() {
  return <div>Terms of Service</div>;
}

function Privacy() {
  return <div>Privacy Policy</div>;
}

// Removed CreatorProjects placeholder function

// function CreatorTasks() {
//   return <div>Creator Tasks Page</div>;
// }

function CreatorApplications() {
  return <div>Creator Applications Page</div>;
}

function CreatorChat() {
  return <div>Creator Chat Page</div>;
}

function CreatorMentors() {
  return <div>Creator Mentors Page</div>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<LandingPage />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="features" element={<Features />} />
        <Route path="contact" element={<Contact />} />
        <Route path="projects" element={<Projects />} />
        <Route path="collaborators" element={<Collaborators />} />
        <Route path="register" element={<Register />} />
        <Route path="login/admin" element={<AdminLogin />} />
        <Route path="login/creator" element={<CreatorLogin />} />
        <Route path="login/collaborator" element={<CollaboratorLogin />} />
        <Route path="login/mentor" element={<MentorLogin />} />
        <Route path="login" element={<Login />} />
        {/* <Route path="register/admin" element={<AdminRegister />} /> */}
        <Route path="register/creator" element={<CreatorRegister />} />
        <Route path="register/collaborator" element={<CollaboratorRegister />} />
        <Route path="register/mentor" element={<MentorRegister />} />
        <Route path="login/forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />

        <Route path="/creator" element={<CreatorLayout />}>
          <Route path="dashboard" element={<CreatorDashboardPage />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="tasks" element={<CreatorTasks />} />
          <Route path="applications" element={<CreatorApplications />} />
          <Route path="chat" element={<CreatorChat />} />
          <Route path="mentors" element={<CreatorMentors />} />
          <Route path="profile" element={<CreatorProfile />} />
        </Route>

        <Route path="/collaborator" element={<CollaboratorLayout />}>
          <Route path="dashboard" element={<CollaboratorDashboardPage />} />
          <Route path="profile" element={<CollaboratorProfile />} />
        </Route>

        <Route path="/mentor" element={<MentorLayout />}>
          <Route path="dashboard" element={<MentorDashboardPage />} />
          <Route path="profile" element={<MentorProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="mentor-requests" element={<MentorRequests />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="users" element={<Users />} />
        <Route path="content-moderation" element={<ContentModeration />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>


    </Routes>
  );
}

export default App;
