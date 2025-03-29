import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import './CousePage.css'; // Import CSS for styling
import '@fortawesome/fontawesome-free/css/all.min.css';
import apiURL from '../utils';

// Function to fetch courses
const fetchCourses = async () => {
  const response = await fetch(`${apiURL}/courses`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
};

// Custom Loader Component
const Loader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
    <p>Loading Courses...</p>
  </div>
);

const CoursesPage = () => {
  const navigate = useNavigate();

  // Use React Query to fetch courses
  const { data: courses, error, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  // Show loader while data is loading
  if (isLoading) return <Loader />;
  
  // Handle error while fetching data
  if (error) return <p className="error-message">Error fetching courses: {error.message}</p>;

  return (
    <div>
      <div className="courses-container">
        <h1>Courses</h1>
        <div className="courses-grid">
          {courses.map((course) => (
            <div className="course-card" key={course.cid} onClick={() => navigate(course.link)}>
              <i className={course.icon}></i>
              <h3>{course.course_name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
