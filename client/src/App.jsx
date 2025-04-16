import React from 'react';
import { Route, Routes } from 'react-router';
import LandingPage from './components/pages/landing-page';
import Layout from './components/pages/layout';

function Projects() {
  return <div>Projects Page</div>;
}

function Collaborators() {
  return <div>Collaborators Page</div>;
}

function Register() {
  return <div>Register Page</div>;
}

function LoginAdmin() {
  return <div>Login Admin Page</div>;
}

function LoginCreator() {
  return <div>Login Creator Page</div>;
}

function LoginCollaborator() {
  return <div>Login Collaborator Page</div>;
}

function LoginMentor() {
  return <div>Login Mentor Page</div>;
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
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/collaborators" element={<Collaborators />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/creator" element={<LoginCreator />} />
        <Route path="/login/collaborator" element={<LoginCollaborator />} />
        <Route path="/login/mentor" element={<LoginMentor />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>
    </Routes>
  );
}

export default App;
