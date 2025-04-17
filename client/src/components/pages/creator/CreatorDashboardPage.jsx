import React from 'react';

const CreatorDashboardPage = () => {
  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1>Project Creator Dashboard</h1>
        <div>
          <h2>Project Summary</h2>
          <p>Total Projects: [Total Projects]</p>
          <p>Active Projects: [Active Projects]</p>
          <p>Completed Projects: [Completed Projects]</p>
        </div>
        <div>
          <h2>Recent Applications</h2>
          <p>[Recent Applications]</p>
        </div>
      </div>
    </main>
  );
};

export default CreatorDashboardPage;