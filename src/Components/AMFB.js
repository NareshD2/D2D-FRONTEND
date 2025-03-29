import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { jwtDecode } from 'jwt-decode';
import { FaSpinner } from 'react-icons/fa';
import apiURL from '../utils';

function AMFB() {
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [mentorId, setMentorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mentorData, setMentorData] = useState({ name: '', email: '', phone: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setMentorId(decodedToken.results?.[0]?.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiURL}/mentors`);
      const data = await response.json();
      setUsers(data);
      
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleExpandRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setLoading(false)
    setIsModalOpen(false);
    setMentorData({ name: '', email: '', phone: '' });
  };

  const handleChange = (e) => {
    setMentorData({ ...mentorData, [e.target.name]: e.target.value });
  };

  const handleAddMentor = async () => {
    if (!mentorData.name || !mentorData.email || !mentorData.phone) {
      alert("Please fill all fields.");
      return;
    }
  
    // Optimistically update the UI to show the new mentor before the server responds
    setUsers(prevUsers => [
      ...prevUsers,
      { id: Date.now(), name: mentorData.name, email: mentorData.email, phone: mentorData.phone }
    ]);
  
    // Close the modal
    closeModal();
    
    try {
      const response = await fetch(`${apiURL}/mentors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mentorData),
      });
  
      const responseData = await response.json(); // Get the response data
      console.log("Mentor added:", responseData);
      
      // Update the users after the new mentor is successfully added
      fetchUsers();
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding mentor:", error);
      // Optionally, revert the optimistic UI update if the API call fails
      fetchUsers();
    }
  };
  

  const handleDeleteMentor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;

    try {
      const response = await fetch(`${apiURL}/mentors/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
      } else {
        console.error("Error deleting mentor");
      }
    } catch (error) {
      console.error("Error deleting mentor:", error);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="main-container">
      <h2>Mentor Feedback</h2>
      <button className="add-mentor-btn" onClick={openModal}>Add Mentor</button>

      <table className="mentor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <React.Fragment key={user.id}>
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button onClick={() => toggleExpandRow(user.id)}>+</button>
                  <button className="delete-btn" onClick={() => handleDeleteMentor(user.id)}>Delete</button>
                </td>
              </tr>
              {expandedRows[user.id] && (
                <tr>
                  <td colSpan="4" className="expanded-row">
                    <button>Provide Feedback</button>
                    <button>Send Notification</button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
          {showSuccess ? (
            <>
              <h3 className="success-message">Mentor Added Successfully! 🎉</h3>
              <button onClick={closeModal}>Close</button>
              </>
            ) : (
              <>
            <h3>Add Mentor</h3>
            <input type="text" name="name" placeholder="Name" value={mentorData.name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={mentorData.email} onChange={handleChange} />
            <input type="tel" name="phone" placeholder="Phone" value={mentorData.phone} onChange={handleChange} />
            <button onClick={handleAddMentor}>
              submit
            </button>
            <button onClick={closeModal} >Close</button>
            </>)}
          </div>
        </div>
      )
      
      
      }

      

      <style>{`
        .main-container {
          transition: filter 0.3s ease;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          width: 300px;
          text-align: center;
          z-index: 1001;
        }
        input {
          width: 90%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          margin: 5px;
          padding: 10px 15px;
          border: none;
          background: green;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }
        .delete-btn {
          background: red;
        }
        .mentor-table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .expanded-row {
          background-color: #f9f9f9;
        }
        .success-message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: green;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          animation: fadeOut 2s forwards;
          z-index: 1002;
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default AMFB;
