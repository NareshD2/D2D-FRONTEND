import React, { useEffect, useState } from 'react';

import './CreateAssignment.css';
import apiURL from '../utils';

const CreateAssignment = () => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [references, setReferences] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch(`${apiURL}/courses`);
      const data = await response.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const handleCreateAssignment = async () => {
    await fetch(`${apiURL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, title, dueDate, references })
    });
    alert('Assignment created');
  };

  return (
    <div className="create-assignment-container">
      
      <h2 className="create-assignment-header">Create Assignment</h2>
      <div className="assignment-form">
        <label htmlFor="course">Course</label>
        <select id="course" onChange={(e) => setCourseId(e.target.value)}>
          <option>Select a course</option>
          {courses.map((course) => (
            <option key={course.cid} value={course.cid}>
              {course.course_name}
            </option>
          ))}
        </select>
        
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Assignment Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          onChange={(e) => setDueDate(e.target.value)}
        />
        
        <label htmlFor="references">References (Optional)</label>
        <input
          id="references"
          type="text"
          placeholder="Any reference material or links"
          onChange={(e) => setReferences(e.target.value)}
        />
        
        <button onClick={handleCreateAssignment}>Create Assignment</button>
      </div>
    </div>
  );
};

export default CreateAssignment;
