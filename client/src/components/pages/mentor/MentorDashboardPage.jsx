import React from 'react';
import { Link } from 'react-router';

function MentorDashboardPage() {
  return (
    <div>
      <h1>Mentor Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <Link to="/mentor/profile">View Profile</Link>
    </div>
  );
}

export default MentorDashboardPage;