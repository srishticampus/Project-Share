import React from 'react';
import { Outlet } from 'react-router';

function MentorLayout() {
  return (
    <div>
      <h1>Mentor Layout</h1>
      <Outlet />
    </div>
  );
}

export default MentorLayout;