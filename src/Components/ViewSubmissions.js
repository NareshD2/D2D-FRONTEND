import React, { useEffect, useState } from 'react';
import './ViewSubmissions.css';
import apiURL from '../utils';

function ViewSubmissions() {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const response = await fetch(`${apiURL}/submissions`);
            const data = await response.json();
            setSubmissions(data);
        };
        fetchSubmissions();
    }, []);

    return (

        <div className="mentor-view-container">
        
            <h2>Student Submissions</h2>
            <div className="submissions-list">
                {submissions.map((submission) => (
                    <div key={`${submission.assignment_id}-${submission.student_id}`} className="submission-card">
                        <h3>{submission.title}</h3>
                        <p><strong>Student:</strong> {submission.student_name}</p>
                        <p><strong>Submission Date:</strong> {submission.submission_date}</p>
                        <a href={submission.upload_link} target="_blank" rel="noopener noreferrer" className="upload-link">
                            View Submission
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewSubmissions;
