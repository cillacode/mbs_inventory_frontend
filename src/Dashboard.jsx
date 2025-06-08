// src/Dashboard.jsx
import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name || 'User'}!</h2>
      <p>This is your dashboard. 🎉</p>
    </div>
  );
};

export default Dashboard;
