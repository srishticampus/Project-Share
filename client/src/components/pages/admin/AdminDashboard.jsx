import React from 'react';
import { Card } from "@/components/ui/card"
import { Link } from 'react-router';

function AdminDashboard() {
  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Total Project Creators</h2>
              <p className="text-2xl">100</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Total Collaborators</h2>
              <p className="text-2xl">500</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Total Mentors/Experts</h2>
              <p className="text-2xl">50</p>
            </div>
          </Card>
          <Card className="md:col-span-2">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Recent Projects</h2>
              <ul>
                <li>Project 1</li>
                <li>Project 2</li>
                <li>Project 3</li>
              </ul>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Recent Reports</h2>
              <ul>
                <li>Report 1</li>
                <li>Report 2</li>
                <li>Report 3</li>
              </ul>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <Link to="/admin/profile">View Profile</Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;