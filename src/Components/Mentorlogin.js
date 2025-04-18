import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import apiURL from '../utils';

const Mentorlogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      setErrorMessage('Please fill in both fields');
      return;
    }

    try {
      let response = await fetch(`${apiURL}/api/Mentorlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' 
      });
      if (!response.ok) {
              throw new Error(`Login failed: ${response.statusText}`);
            }
      
            const data = await response.json();
      
            if (data.auth) {
              // Store the token in cookies
              Cookies.set("session", data.auth, { expires: 1, secure: false, sameSite: "None" });
      
              setErrorMessage("");
              navigate("/Mentorinterface");
            } else {
              setErrorMessage('Enter correct details');
            }
          } catch (error) {
            setErrorMessage(`An error occurred: ${error.message}`);
          }

      
  };

  return (
    <div>
      <Navbar />
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Mentor Login</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn">Submit</button>
          <p className="back-home">
            <a href="/mainpage" className="back-home-link">Back to Homepage</a>
          </p>
          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
  

};

export default Mentorlogin;
