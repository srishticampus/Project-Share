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
        <Route path="register/admin" element={<AdminRegister />} />
        <Route path="register/creator" element={<CreatorRegister />} />
        <Route path="register/collaborator" element={<CollaboratorRegister />} />
        <Route path="register/mentor" element={<MentorRegister />} />
        <Route path="login/forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
