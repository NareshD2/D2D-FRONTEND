import React from 'react'
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar2 = ({ isSidebarOpen, toggleSidebar, handleNavigation }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>&times;</button>
        <ul>
            <li><Link to="/Admininterface"><i className="fas fa-home"></i> Home</Link></li>
            <li><Link to="/courses"><i className="fas fa-book"></i> Courses</Link></li>
            <li><Link to="/StudentsDetails"><i className="fas fa-tasks"></i> Students Details</Link></li>
            <li><Link to="/MentorDetails"><i className="fas fa-bullseye"></i> Mentor Details</Link></li>
            <li><Link to="/addgoal"><i className="fas fa-running"></i> Add Goal</Link></li>
            <li><Link to="/motivational-videos"><i className="fas fa-video"></i> Motivational Videos</Link></li>
            <li><Link to="/notifications"><i className="fas fa-envelope"></i> Notifications</Link></li>
        </ul>
      
    </div>
  )
}

export default Sidebar2
