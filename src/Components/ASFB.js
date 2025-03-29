import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import apiURL from '../utils';

function ASFB() {
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [mentorId, setMentorId] = useState(null);
  const [mentortype, setMentortype] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve and decode the token to get mentorId
  useEffect(() => {
    const token = Cookies.get('session');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const mentorIdFromToken = decodedToken.results?.[0]?.id;
        const mentor = decodedToken.usertype;
        setMentorId(mentorIdFromToken);
        setMentortype(mentor);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiURL}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchUsers();
    }
  }, [mentorId]);

  const toggleExpandRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleProvideFeedback = async (studentId) => {
    if (!mentorId) {
      alert("Mentor ID is missing. Please log in again.");
      return;
    }

    const feedback = prompt("Enter your feedback:");
    if (feedback && feedback.trim() !== "") {
      try {
        const response = await fetch(`${apiURL}/feedbacks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            sendor_id: mentorId,
            sendortype: mentortype,
            feedback,
          }),
        });

        if (response.ok) {
          alert("Feedback saved successfully");
        } else {
          console.error("Error saving feedback");
          alert("Error saving feedback");
        }
      } catch (error) {
        console.error("Error saving feedback:", error);
      }
    }
  };

  const handleSendNotification = async (studentId) => {
    if (!mentorId || !mentortype) {
      alert("Mentor ID is missing. Please log in again.");
      return;
    }

    const message = prompt("Enter your notification message:");
    if (message && message.trim() !== "") {
      try {
        const response = await fetch('http://localhost:5000/notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            mentor_id: mentorId,
            message,
          }),
        });

        if (response.ok) {
          alert("Notification sent successfully");
        } else {
          console.error("Error sending notification");
          alert("Error sending notification");
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <h2>User Feedback</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <React.Fragment key={user.id || index}>
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button onClick={() => toggleExpandRow(user.id)}>
                    {expandedRows[user.id] ? '−' : '+'}
                  </button>
                </td>
              </tr>
              {expandedRows[user.id] && (
                <tr>
                  <td colSpan={4} style={{ backgroundColor: '#f9f9f9' }}>
                    <button onClick={() => handleProvideFeedback(user.id)}>
                      Provide Feedback
                    </button>
                    <button onClick={() => handleSendNotification(user.id)}>
                      Send Notification
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ASFB;
