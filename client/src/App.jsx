import React from 'react';
import { Route, Routes, useParams } from 'react-router';
import ChatInterface from './components/ChatInterface';
import ChatWithCollaborators from './components/pages/creator/ChatWithCollaborators';
import Layout from './components/pages/layout';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Features from './components/pages/Features';
import NotFound from './components/pages/NotFound';
import LandingPage from './components/pages/landing-page';
import CreatorRegister from './components/pages/register/creator';
import CollaboratorRegister from './components/pages/register/collaborator';
import MentorRegister from './components/pages/register/mentor';
import ForgotPassword from './components/pages/login/ForgotPassword';
import ResetPassword from './components/pages/login/ResetPassword';
import AdminLayout from './components/pages/admin/AdminLayout';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import MentorRequests from './components/pages/admin/MentorRequests';
import AdminProjectsPage from './components/pages/admin/Projects';
import Users from './components/pages/admin/Users';
import ContentModeration from './components/pages/admin/ContentModeration';
import Analytics from './components/pages/admin/Analytics';
import CreatorDashboardPage from './components/pages/creator/CreatorDashboardPage';
import CreatorLayout from './components/pages/creator/CreatorLayout';
import ProjectManagement from './components/pages/creator/ProjectManagement'; // Import the new component
import CollaboratorDashboardPage from './components/pages/collaborator/CollaboratorDashboardPage';
import MentorDashboardPage from './components/pages/mentor/MentorDashboardPage';
import AdminLogin from './components/pages/login/admin';
import AdminProfile from './components/pages/admin/Profile';
import CreatorLogin from './components/pages/login/creator';
import CreatorProfile from './components/pages/creator/Profile';
import CollaboratorLogin from './components/pages/login/collaborator';
import CollaboratorProfile from './components/pages/collaborator/Profile';
import MentorLogin from './components/pages/login/mentor';
import MentorProfile from './components/pages/mentor/Profile';
import CollaboratorLayout from './components/pages/collaborator/CollaboratorLayout';
import MentorLayout from './components/pages/mentor/MentorLayout';
import CreatorTasks from './components/pages/creator/CreatorTasks';
import Login from './components/pages/login/Login';
import Projects from './components/pages/Projects'; // Import the new Projects component
import ProjectDetails from './components/pages/ProjectDetails';
import ContactSubmissions from './components/pages/admin/ContactSubmissions';
import BrowseProjects from './components/pages/collaborator/BrowseProjects'; // Import new collaborator components
import AppliedProjects from './components/pages/collaborator/AppliedProjects';
import ActiveProjects from './components/pages/collaborator/ActiveProjects';
import CompletedProjects from './components/pages/collaborator/CompletedProjects';
import Portfolio from './components/pages/collaborator/Portfolio';
import ChatWithCreators from './components/pages/collaborator/ChatWithCreators';
import ConnectWithMentors from './components/pages/collaborator/ConnectWithMentors';
import CollaboratorProjectDetails from './components/pages/collaborator/ProjectDetails'; // Rename to avoid conflict

// New Mentor Page Imports
import MentorshipRequests from './components/pages/mentor/MentorshipRequests';
import ActiveMentorships from './components/pages/mentor/ActiveMentorships';
import MentorBrowseProjects from './components/pages/mentor/BrowseProjects'; // Renamed to avoid conflict with collaborator's BrowseProjects
import CreateArticle from './components/pages/mentor/CreateArticle';
import ViewArticles from './components/pages/mentor/ViewArticles';
import ChatWithMentees from './components/pages/mentor/ChatWithMentees';
import MentorProjectDetails from './components/pages/mentor/MentorProjectDetails'; // New mentor project details component
import ViewArticleDetails from './components/pages/mentor/ViewArticleDetails'; // New mentor article details component
import EditArticle from './components/pages/mentor/EditArticle'; // New mentor edit article component
import MentorshipDetails from './components/pages/mentor/MentorshipDetails'; // Import new MentorshipDetails component
import CreatorConnectWithMentors from './components/pages/creator/ConnectWithMentors'; // Renamed to avoid conflict

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

import CreatorApplications from './components/pages/creator/CreatorApplications'; // Import the actual component
import { API_URL } from './lib/constant';

function CreatorChat() {
  return <div>Creator Chat Page</div>;
}

function CreatorMentors() {
  return <div>Creator Mentors Page</div>;
}

function App() {
  console.log("env variable for API:",API_URL)
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<LandingPage />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="features" element={<Features />} />
        <Route path="contact" element={<Contact />} />
        <Route path="projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} /> {/* Add the new route */}
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
          <Route path="chat" element={<ChatWithCollaborators />} />
          <Route path="mentors" element={<CreatorConnectWithMentors />} /> {/* Updated to new component */}
          <Route path="profile" element={<CreatorProfile />} />
          <Route path="chat/:userId" element={<ChatInterfaceWrapper />} /> {/* Nested chat route */}
        </Route>

        {/* Collaborator Profile route moved outside of CollaboratorLayout */}
        <Route path="/collaborator/profile/:id" element={<CollaboratorProfile />} />

        <Route path="/collaborator" element={<CollaboratorLayout />}>
          <Route path="dashboard" element={<CollaboratorDashboardPage />} />
          <Route path="browse-projects" element={<BrowseProjects />} />
          <Route path="my-projects/applied" element={<AppliedProjects />} />
          <Route path="my-projects/active" element={<ActiveProjects />} />
          <Route path="my-projects/completed" element={<CompletedProjects />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="chat-with-creators" element={<ChatWithCreators />} />
          <Route path="connect-with-mentors" element={<ConnectWithMentors />} />
          <Route path="profile" element={<CollaboratorProfile />} /> {/* Current user's profile */}
          <Route path="projects/:projectId" element={<CollaboratorProjectDetails />} /> {/* Route for collaborator project details */}
          <Route path="chat/:userId" element={<ChatInterfaceWrapper />} /> {/* Nested chat route */}
        </Route>

        {/* Mentor Profile route moved outside of MentorLayout */}
        <Route path="/mentor/profile/:id" element={<MentorProfile />} />

        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<MentorDashboardPage />} />
          <Route path="profile" element={<MentorProfile />} />
          <Route path="mentorship-requests" element={<MentorshipRequests />} /> {/* New mentor route */}
          <Route path="active-mentorships" element={<ActiveMentorships />} /> {/* New mentor route */}
          <Route path="browse-projects" element={<MentorBrowseProjects />} /> {/* New mentor route */}
          <Route path="create-article" element={<CreateArticle />} /> {/* New mentor route */}
          <Route path="articles" element={<ViewArticles />} /> {/* New mentor route */}
          <Route path="chat-with-mentees" element={<ChatWithMentees />} /> {/* New mentor route */}
          <Route path="chat/:userId" element={<ChatInterfaceWrapper />} /> {/* Nested chat route */}
          <Route path="projects/:projectId" element={<MentorProjectDetails />} /> {/* New mentor project details route */}
          <Route path="mentorship-details/:id" element={<MentorshipDetails />} /> {/* New mentor mentorship details route */}
          <Route path="articles/:articleId" element={<ViewArticleDetails />} /> {/* Route for viewing specific articles */}
          <Route path="articles/:articleId/edit" element={<EditArticle />} /> {/* Route for editing specific articles */}
        </Route>
        <Route path="/articles/:articleId" element={<ViewArticleDetails />} /> {/* Route for viewing specific articles */}

        {/* Creator Profile route moved outside of CreatorLayout */}
        <Route path="/creator/profile/:id" element={<CreatorProfile />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="mentor-requests" element={<MentorRequests />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="users" element={<Users />} />
        <Route path="content-moderation" element={<ContentModeration />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="contact-submissions" element={<ContactSubmissions />} />
      </Route>
    </Routes>
  );
}

function ChatInterfaceWrapper() {
  const { userId } = useParams();
  return <ChatInterface receiverId={userId} className="h-full" />;
}

export default App;
