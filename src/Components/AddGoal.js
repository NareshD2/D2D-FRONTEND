import React, { useState, useEffect } from "react";
import apiURL from "../utils";
const AddGoal = () => {
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch all goals from the database
  const fetchGoals = async () => {
    try {
      const response = await fetch(`${apiURL}/api/set-goal`);
      const data = await response.json();
      console.log(data);
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Function to add a new goal
  const addGoal = async () => {
    
  };

  const handleChange = (e) => {
    setGoal(e.target.value);
    console.log(goal);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) {
      setMessage("Goal cannot be empty");
      setShowOverlay(true);
      return;
    }
    setGoals((prevGoals) => [...prevGoals, { goal }]);
    closeModal();
    try {
      const response = await fetch(`${apiURL}/api/Addgoals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      });
      const data = await response.json();
      if (data.exists) {
        setMessage("Goal already exists");
      } else {
        setMessage("Goal added successfully");
        fetchGoals(); // Refresh goals list after adding
      }
    } catch (error) {
      setMessage("Error adding goal");
    }
  
    setGoal(""); // Clear input field after submission
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setGoal("");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Goals</h2>
      <button className="add-mentor-btn" onClick={openModal}>Add a Goal</button>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Existing Goals</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">S.No</th>
              <th className="border border-gray-300 p-2">Goal</th>
            </tr>
          </thead>
          <tbody>
            {goals.length > 0 ? (
              goals.map((g, index) => (
                <tr key={g._id} className="text-center">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{g.goalName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="border border-gray-300 p-2 text-center">No goals found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg transition-opacity">
          <div className="bg-white p-4 rounded-md shadow-lg animate-fadeIn">
            <p className="text-lg font-medium">{message}</p>
            <button onClick={() => setShowOverlay(false)} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
              OK
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {showSuccess ? (
              <>
                <h3 className="success-message">Goal Added Successfully! 🎉</h3>
                <button onClick={closeModal}>Close</button>
              </>
            ) : (
              <>
                <h3>Add a Goal</h3>
                <input type="text" name="name" placeholder="Name" value={goal} onChange={handleChange} />
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={closeModal}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
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
};

export default AddGoal;
