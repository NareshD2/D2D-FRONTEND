import React, { useState, useEffect } from 'react';
import Navbar1 from './Navbar1';
import { jwtDecode } from 'jwt-decode';
import './GoalSetting.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import apiURL from '../utils';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; 
import { ClipLoader } from 'react-spinners'; 
const GoalSetting = () => {
  const [goal, setGoal] = useState('');
  const [gid, setGid] = useState('');
  const [objective, setObjective] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [goalOptions, setGoalOptions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve and decode token to get userId
  const token = Cookies.get('session');
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.results && Array.isArray(decodedToken.results)) {
        userId = decodedToken.results.length > 0 ? decodedToken.results[0].id : null;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`${apiURL}/api/set-goal`);
        if (!response.ok) {
          throw new Error(`Failed to fetch goals. Status: ${response.status}`);
        }
        const data = await response.json();
        setGoalOptions(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch goals');
      }
    };

    fetchGoals();

    
    setObjective('Initial Objective');
    setTargetDate(new Date().toISOString().split('T')[0]); 
  }, []);
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const handleGoalChange = (e) => {
    const selectedGoalId = Number(e.target.value); 
    const selectedGoal = goalOptions.find(goal => goal.id === selectedGoalId);

    setGid(selectedGoalId);
    setGoal(selectedGoal ? selectedGoal.goalName : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gid || !objective.trim() || !targetDate) {
      setError('Please fill in all fields');
      return;
    }
    if (!userId) {
      setError('User authentication failed. Please log in again.');
      return;
    }
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${apiURL}/api/set-goal`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({
          userId, // Include the extracted userId
          gid,
          targetDate,
          objective,
        }),
      });
      if (response.status === 200) {
        setPopupType('success');
        setPopupMessage('Goal Registered Successfully');
        setIsPopupVisible(true);
        setErrorMessage('');
        setGid('');
        setGoal('');
        setObjective('');
        setTargetDate('');
        navigate('/userinterface');
         

        
      } else if (response.status === 400) {
        setPopupType('error');
        setPopupMessage('You have already registered the goal');
        setIsPopupVisible(true);
        setErrorMessage('');
        setGid('');
        setGoal('');
        setObjective('');
        setTargetDate('');
      } else {
        setErrorMessage(data.message);
      }

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      setError(error.message || 'Server error');
    }
  };

  return (
    <div>
       <Navbar1 />
    <div className="goal-setting-container">
     
      <h2>Set Your Goal</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="goal-form">
        <label>
          Goal:
          <select value={gid} onChange={handleGoalChange}>
            <option value="">Select a goal</option>
            {goalOptions.map((goalOption) => (
              <option key={goalOption.id} value={goalOption.id}>
                {goalOption.goalName}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Objective:
          <input
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
        </label>
        <br />
        <label>
          Target Date:
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Goal</button>
      </form>
    </div>
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

export default GoalSetting;
