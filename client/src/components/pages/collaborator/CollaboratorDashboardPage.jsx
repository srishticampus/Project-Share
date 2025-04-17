import React from 'react';
import { Link } from 'react-router';

function CollaboratorDashboardPage() {
  return (
    <div>
      <h1>Collaborator Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <Link to="/collaborator/profile">View Profile</Link>
    </div>
  );
}

export default CollaboratorDashboardPage;