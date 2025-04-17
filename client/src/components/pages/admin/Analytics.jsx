import React from 'react';

function Analytics() {
  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <h1>Platform Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg">
            <h2>User Engagement</h2>
            {/* Placeholder chart */}
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              Chart Placeholder
            </div>
          </div>
          <div className="border p-4 rounded-lg">
            <h2>Project Success Rate</h2>
            {/* Placeholder chart */}
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              Chart Placeholder
            </div>
          </div>
          <div className="border p-4 rounded-lg">
            <h2>Popular Categories</h2>
            {/* Placeholder chart */}
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              Chart Placeholder
            </div>
          </div>
          <div className="border p-4 rounded-lg">
            <h2>User Growth</h2>
            {/* Placeholder chart */}
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              Chart Placeholder
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Analytics;