import React, { useEffect, useState } from 'react';
import Navbar1 from './Navbar1';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import apiURL from '../utils';
function UserFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
   // Adjust based on your user authentication setup
   const token = Cookies.get('session');
   let userId;
 
   if (token) {
     const decodedToken = jwtDecode(token);
     userId = decodedToken.results && decodedToken.results[0].id; // Extract userId from results array
     console.log("Decoded User ID:", userId); // Log for debugging; // Update 'id' based on your JWT payload structure
   }
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${apiURL}/user-feedback/${userId}`);
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [userId]);

  return (
    <div>
      <Navbar1/>
      <h2>Your Feedback</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Feedback</th>
            <th>Mentor Name</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback, index) => (
            <tr key={index}>
              <td>{feedback.feedback}</td>
              <td>{feedback.sender_name}</td>
              <td>{new Date(feedback.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserFeedback;
