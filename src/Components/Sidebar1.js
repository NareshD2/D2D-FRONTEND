import React from 'react'
import './Sidebar.css';

const Sidebar1 = ({ isSidebarOpen, toggleSidebar, handleNavigation }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>&times;</button>
        <ul>
          <li><a href="/Mentorinterface"><i className="fas fa-home"></i> Home</a></li>
          <li><a href="/courses1"><i className="fas fa-book"></i> Courses</a></li>
          <li><a href="/assignments"><i className="fas fa-tasks"></i>Post Assignments</a></li>
          <li><a href="/viewassignment"><i className="fas fa-running"></i>view Assignments</a></li>
          <li><a href="/MentorFeedBack"><i className="fas fa-comment"></i> Feedbacks</a></li>
          <li><a href="/trackprogress"><i className="fas fa-chart-line"></i> Track Progress</a></li>
          <li><a href="/motivational-videos"><i className="fas fa-video"></i> Motivational Videos</a></li>
          <li><a href="/MentorPosts"><i className="fas fa-bell"></i> Job Alerts</a></li>
          <li><a href="/notifications"><i className="fas fa-envelope"></i> Notifications</a></li>
        </ul>
      
    </div>
  )
}

export default Sidebar1
