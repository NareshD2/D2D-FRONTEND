import React, { useState, useEffect } from 'react';
import Navbar1 from './Navbar1';
import { jwtDecode } from 'jwt-decode';
import './GoalSetting.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import apiURL from '../utils';
const GoalSetting = () => {
  const [goal, setGoal] = useState('');
  const [gid, setGid] = useState('');
  const [objective, setObjective] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [goalOptions, setGoalOptions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

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

    // Set default values for objective and targetDate
    setObjective('Initial Objective');
    setTargetDate(new Date().toISOString().split('T')[0]); // Defaults to today's date
  }, []);

  const handleGoalChange = (e) => {
    const selectedGoalId = Number(e.target.value); // Convert to number
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

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid server response');
      }

      if (response.ok) {
        setGid('');
        setGoal('');
        setObjective('');
        setTargetDate('');
        setSuccessMessage('Goal created successfully!');
        navigate('/Userinterface')
      } else {
        setError(data.message || 'Failed to create goal');
      }
    } catch (error) {
      setError(error.message || 'Server error');
    }
  };

  return (
    <div className="goal-setting-container">
      <Navbar1 />
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
  );
};

export default GoalSetting;
