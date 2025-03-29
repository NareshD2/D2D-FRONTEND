import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isSidebarOpen, toggleSidebar, handleNavigation }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>&times;</button>
      <ul>
        <li><a onClick={() => handleNavigation('/Userinterface')}><i className="fas fa-home"></i> Home</a></li>
        <li><a onClick={() => handleNavigation('/courses')}><i className="fas fa-book"></i> Courses</a></li>
        <li><a onClick={() => handleNavigation('/submitassignments')}><i className="fas fa-tasks"></i> Assignments</a></li>
        <li><a onClick={() => handleNavigation('/set-goal')}><i className="fas fa-bullseye"></i> Set Goal</a></li>
        <li><a onClick={() => handleNavigation('/userfeedback')}><i className="fas fa-comment"></i> Feedbacks</a></li>
        <li><a onClick={() => handleNavigation('/Userjobalerts')}><i className="fas fa-bell"></i> Job Alerts</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
