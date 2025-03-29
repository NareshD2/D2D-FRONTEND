import React, { useEffect, useState } from 'react';
import './Userinterface.css';
import Cookies from 'js-cookie';
import apiURL from '../utils';

 // Ensure the file name is correct
import '@fortawesome/fontawesome-free/css/all.min.css';
import {jwtDecode} from 'jwt-decode'; // Use default import for jwt-decode
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const Admininterface = () => {
  const courseProgress = 85;
  const labProgress = 10;
  const assignmentProgress = 60;

  const [goals, setGoals] = useState([]); // State to store fetched goals
  const [courses, setCourses] = useState([]);

  const getUserIdFromToken = () => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.results && decodedToken.results[0].id;
    }
    return null;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = getUserIdFromToken();
        if (userId) {
          const response = await fetch(`${apiURL}/courses1/${userId}`);
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch goals from the backend
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      fetch(`${apiURL}/api/goals/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setGoals(data.goals || []); // Handle response structure
        })
        .catch((error) => console.error("Error fetching goals:", error));
    }
  }, []);

  return (
    <div className="progress-page1">
   
      <h1>Welcome To Drive to Destiny</h1>
    </div>
  );
};

export default Admininterface;
