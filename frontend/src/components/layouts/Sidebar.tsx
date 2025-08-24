import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 hidden md:block">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      <ul>
        <li>Dashboard</li>
        <li>Vehicle Logs</li>
        <li>Settings</li>
      </ul>
    </aside>
  );
};

export default Sidebar;