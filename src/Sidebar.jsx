import React, { useState } from 'react';
import './Sidebar.css'; // Import the CSS file for styling

const Sidebar = ({ setActiveTable, hideSidebar }) => {
  const sidebarClasses = `sidebar ${hideSidebar ? 'hidden' : ''}`;

  return (
    <div className={sidebarClasses}>
      <button onClick={() => setActiveTable('withdrawal')}>Withdrawal Requests</button>
      <button onClick={() => setActiveTable('users')}>All Users</button>
    </div>
  );
};

export default Sidebar;
