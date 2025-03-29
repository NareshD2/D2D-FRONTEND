import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import Sidebar1 from './Sidebar1';
import Sidebar2 from './Sidebar2';
import './Navbar1.css';

const Navbar1 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const token = Cookies.get('session');

  const getUserInfoFromToken = () => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.results?.[0]?.name || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  const getUserTypeFromToken = () => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.usertype || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const name = getUserInfoFromToken();
    const type = getUserTypeFromToken();

    if (name) setUserName(name);
    if (type) setUserType(type);
  }, []);

  const handleNavigation = (path) => {
    queryClient.invalidateQueries();
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove('session'); // Remove cookie
    setIsDropdownOpen(false);
    navigate('/mainpage');
  };

  // Function to determine the correct Sidebar component
  const renderSidebar = () => {
    if (userType === 'student') return <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleNavigation={handleNavigation} />;
    if (userType === 'mentor') return <Sidebar1 isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleNavigation={handleNavigation} />;
    if (userType === 'admin') return <Sidebar2 isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleNavigation={handleNavigation} />;
    return null; // If no matching type, return nothing
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-navbar">
        <button className="hamburger" onClick={toggleSidebar}>
          &#9776;
        </button>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <i className="fas fa-road"></i>
            <span className="title">Drive to Destiny</span>
          </a>
          <div className="user-info">
            {userName && (
              <div className="user-profile">
                <i className="fas fa-user-circle user-icon"></i>
                <span className="user-name" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  {userName} ({userType}) <i className="fas fa-caret-down"></i>
                </span>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <ul>
                      <li onClick={() => handleNavigation('/Profile')}>
                        <i className="fas fa-user"></i> Profile
                      </li>
                      <li onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Conditionally render the appropriate sidebar */}
      {renderSidebar()}
    </div>
  );
};

export default Navbar1;
