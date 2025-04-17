import React from 'react';
import { Outlet } from 'react-router';

function CollaboratorLayout() {
  return (
    <div>
      <h1>Collaborator Layout</h1>
      <Outlet />
    </div>
  );
}

export default CollaboratorLayout;
