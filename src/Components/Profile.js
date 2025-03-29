import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import apiURL from '../utils';
const Profile = () => {
  const [userData, setUserData] = useState({ id: '', name: '', email: '', phone: '', password: '', usertype: '' });
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(3);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get('session');

  const getUserFromToken = () => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.results?.[0] || null;
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
    const user = getUserFromToken();
    const usertype1 = getUserTypeFromToken();
    if (user) {
      setUserData({ id: user.id, name: user.name, email: user.email, phone: user.phone, password: user.password, usertype: usertype1 });
    }
  }, []);

  useEffect(() => {
    let countdown;
    if (showModal) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setShowModal(false);
            navigate('/mainpage');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [showModal, navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedUserData = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password || undefined,
      usertype: userData.usertype,
    };
    setShowModal(true);
        setTimer(3);
    try {
      const response = await fetch(`${apiURL}/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      setLoading(false);
      const responseData = await response.json();

      if (response.status === 201) {
        console.log("Profile updated successfully");
        setMessage('Profile updated successfully!');
        setShowModal(true);
        setTimer(3);
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile.');
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      {message && <p className="message">{message}</p>}

      <form className="profile-form" onSubmit={handleUpdate}>
        <table className="profile-table">
          <tbody>
            <tr><td><label>Name:</label></td><td><input type="text" name="name" value={userData.name} onChange={handleChange} required /></td></tr>
            <tr><td><label>Email:</label></td><td><input type="email" name="email" value={userData.email} onChange={handleChange} required /></td></tr>
            <tr><td><label>Phone:</label></td><td><input type="text" name="phone" value={userData.phone} onChange={handleChange} required /></td></tr>
            <tr><td><label>Password (optional):</label></td><td><input type="text" name="password" value={userData.password} onChange={handleChange} /></td></tr>
          </tbody>
        </table>
        <div className="button-group">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? <ClipLoader size={20} color="#fff" /> : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Modal with Timer */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="checkmark">✔</span>
            <p>Profile updated successfully!</p>
            <p>Redirecting to login page in {timer}... seconds</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
