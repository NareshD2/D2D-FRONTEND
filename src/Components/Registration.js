import React, { useState } from 'react';
import './Registration.css'; // Import custom CSS
import Navbar from './Navbar';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; 
import { ClipLoader } from 'react-spinners'; 
import apiURL from '../utils';
const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !password) {
      setErrorMessage('Please fill all fields');
      return;
    }
    
    setLoading(true); // Start loading
    
    try {
      const response = await fetch(`${apiURL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();
      
      if (response.status === 201) {
        setPopupType('success');
        setPopupMessage('Registration Successful!');
        setIsPopupVisible(true);
        setErrorMessage('');
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
      } else if (response.status === 409) {
        setPopupType('error');
        setPopupMessage('User already exists');
        setIsPopupVisible(true);
        setErrorMessage('');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setPopupType('error');
      setPopupMessage('An error occurred: ' + error.message);
      setIsPopupVisible(true);
    } finally {
      setLoading(false); // Stop loading after response
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      <Navbar/>
      <div className="register-form-container">
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Register</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="tel" className="form-control" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary register-btn" disabled={loading}>
            {loading ? <ClipLoader size={20} color="#fff" /> : 'Register'}
          </button>
          <p className="back-home">
            <a href="/mainpage" className="back-home-link">Back to Homepage</a>
          </p>
          {errorMessage && <p className="error-text">{errorMessage}</p>}

        </form>
      </div>

      {/* Success/Error Popup */}
      {isPopupVisible && (
        <div className={`popup ${popupType === 'success' ? 'popup-success' : 'popup-error'}`}>
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            <div className="popup-icon">
              {popupType === 'success' ? (
                <FaCheckCircle size={50} color="green" />
              ) : (
                <FaExclamationCircle size={50} color="red" />
              )}
            </div>
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
