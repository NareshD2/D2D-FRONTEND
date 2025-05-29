import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Customerlogin.css';
import { ClipLoader } from 'react-spinners';
import apiURL from '../utils';
import {Link} from 'react-router-dom';
const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
   const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both fields');
      return;
    }
    setLoading(true); 
    try {
      const response = await fetch(`${apiURL}/api/Customerlogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Ensures cookies are handled correctly
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.auth) {
        // Store the token in cookies
        Cookies.set("session", data.auth, { expires: 1, sameSite: "Strict" });

        setErrorMessage("");
        navigate("/Userinterface",{ replace: true });
      } else {
        setErrorMessage('Enter correct details');
      }
    } catch (error) {
      setErrorMessage(`An error occurred: ${error.message}`);
    }finally{
      setLoading(false); 
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Customer Login</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
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
          <button type="submit" className="btn btn-primary login-btn"> {loading ? <ClipLoader size={20} color="#fff" /> : 'login'}</button>
          {errorMessage && <p className="error-text">{errorMessage}</p>}

          {/* Back to Homepage Link */}
          <p className="back-home">
          <Link to="/mainpage">Back to Homepage</Link> 
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
