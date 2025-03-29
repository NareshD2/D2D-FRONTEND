import React, { useEffect, useState } from 'react';
import Navbar1 from './Navbar1';
import {jwtDecode} from 'jwt-decode';
import './SubmitAssignment.css';
import Cookies from 'js-cookie';
import apiURL from '../utils';

const SubmitAssignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [uploadLink, setUploadLink] = useState('');
    const [submittedAssignments, setSubmittedAssignments] = useState(new Set());

    const token = Cookies.get('session');
  let userId;
  let Name;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.results && decodedToken.results[0].id; // Extract userId from results array
    Name = decodedToken.results && decodedToken.results[0].name; 
    console.log("Decoded User ID:", userId); // Log for debugging; // Update 'id' based on your JWT payload structure
  }

    useEffect(() => {
        const fetchAssignments = async () => {
            const response = await fetch(`${apiURL}/getassignments`);
            const data = await response.json();
            setAssignments(data);
        };
        fetchAssignments();

        const fetchuploaded=async()=>{
            const response1=await fetch(`${apiURL}/submittedassignments?uid=${userId}`);
            const data1=await response1.json();
            console.log(data1);
            //setSubmittedAssignments(new Set(data1));
            setSubmittedAssignments(new Set(data1.map(item => item.assignment_id))); 
        }
        fetchuploaded();
    }, []);

    const handleSubmit = async (assignmentId) => {
        if (!uploadLink) {
            alert("Please enter a Google Drive link before submitting.");
            return;
        }
        await fetch(`${apiURL}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignmentId, uploadLink, studentId: userId, studentName:Name })
        });
        alert('Assignment submitted');
        setSubmittedAssignments((prev) => new Set([...prev, assignmentId]));
        setUploadLink(''); // Clear the link input after submission
    };

    return (
        <div className="submit-assignment-container">
            <Navbar1 />
            <h2>Submit Assignment</h2>
            <input 
                type="text"
                placeholder="Google Drive Link" 
                className="upload-link-input"
                value={uploadLink}
                onChange={(e) => setUploadLink(e.target.value)} 
            />
            <div className="assignments-list">
                {assignments.map((assignment) => (
                    <div 
                        key={assignment.assignment_id} 
                        className={`assignment-card ${submittedAssignments.has(assignment.assignment_id) ? 'submitted' : ''}`}
                    >
                        <div className="assignment-content">
                            <h3>{assignment.title}</h3>
                            <p>Due Date: {assignment.due_date}</p>
                        </div>
                        <button 
                            onClick={() => handleSubmit(assignment.assignment_id)}
                            disabled={submittedAssignments.has(assignment.assignment_id)}
                            className="submit-button"
                        >
                            {submittedAssignments.has(assignment.assignment_id) ? 'Submitted' : 'Submit Assignment'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubmitAssignment;
