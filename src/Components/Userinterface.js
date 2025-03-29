import React, { useEffect, useState } from 'react';
import './Userinterface.css';
import Navbar1 from './Navbar1';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import apiURL from '../utils';
const Userinterface = () => {
  const navigate = useNavigate();
  const courseProgress = 20;
  const labProgress = 5;
  const assignmentProgress = 3;

  const [goals, setGoals] = useState([]);
  const [goalCourses, setGoalCourses] = useState({});

  const getUserIdFromToken = () => {
    const token = Cookies.get('session');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.results?.[0]?.id || null;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      try {
        const goalsResponse = await fetch(`${apiURL}/api/goals/${userId}`);
        const goalsData = await goalsResponse.json();
      
        setGoals(goalsData.goals || []);

        // Fetch courses for all goals in parallel
        const coursesMap = {};
        const courseFetches = goalsData.goals.map(async (goal) => {
          try {
            const response = await fetch(`${apiURL}/courses1/${goal.goal_name}`);
            if (!response.ok) {
              console.error(`Error fetching courses for ${goal.goal_name}:`, response.statusText);
              return;
            }
            const data = await response.json();
            coursesMap[goal.goal_name] = data || [];
          } catch (error) {
            console.error(`Error fetching courses for ${goal.goal_name}:`, error);
          }
        });

        await Promise.all(courseFetches); // Wait for all fetch requests to complete
        setGoalCourses(coursesMap); // Update state once with all course data

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="progress-page1">
      <Navbar1 />
      <div className="progress-container-row">
        <div className="progress-item">
          <h2>Courses</h2>
          <CircularProgressbar
            value={courseProgress}
            text={`${courseProgress}%`}
            styles={buildStyles({ pathColor: 'green', textColor: 'green' })}
          />
          <div className="ui-labels">progress</div>
        </div>

        <div className="progress-item">
          <h2>Labs</h2>
          <CircularProgressbar
            value={labProgress}
            text={`${labProgress}%`}
            styles={buildStyles({ pathColor: 'green', textColor: 'green' })}
          />
          <div className="ui-labels">progress</div>
        </div>

        <div className="progress-item">
          <h2>Assignments</h2>
          <CircularProgressbar
            value={assignmentProgress}
            text={`${assignmentProgress}%`}
            styles={buildStyles({ pathColor: 'green', textColor: 'green' })}
          />
          <div className="ui-labels">progress</div>
        </div>
      </div>

      {/* Goals and Corresponding Courses Section */}
      <div className="goal-course-container">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal.goal_name} className="goal-section">
              <h2>{goal.goal_name}</h2>
              {goalCourses[goal.goal_name]?.length >=0 ? (
                <div className="courses-grid">
                  {goalCourses[goal.goal_name].map((course) => (
                    
                    <div className="course-card" key={course.cid} onClick={() => navigate(course.link)}>
                    <i className={course.icon}></i>
                    <h3>{course.course_name}</h3>
                  </div>
                  
                  ))}
                </div>
              ) : (
                <p>No courses assigned for this goal.</p>
              )}
            </div>
          ))
        ) : (
          <p>No goals registered.</p>
        )}
      </div>
    </div>
  );
};

export default Userinterface;
