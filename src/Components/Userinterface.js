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
  const labProgress = 0;
  const assignmentProgress = 0;

  const [goals, setGoals] = useState([]);
  const [goalCourses, setGoalCourses] = useState({});
  const [overallGoalProgress, setOverallGoalProgress] = useState(0);

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

        const goalsArray = goalsData.goals || [];
        setGoals(goalsArray);

        if (goalsArray.length > 0) {
          const validProgresses = goalsArray
    .map(goal => Number(goal.goal_progress ?? 0));
          //const totalProgress = validProgresses.reduce((sum, goal) => sum + (goal.goal_progress || 0), 0);
          const totalProgress = validProgresses.reduce((sum, progress) => sum + progress, 0);

          const averageProgress = totalProgress / validProgresses.length;
          setOverallGoalProgress(averageProgress);
        } else {
          setOverallGoalProgress(0);
        }

        const coursesMap = {};
        const courseFetches = goalsArray.map(async (goal) => {
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

        await Promise.all(courseFetches);
        setGoalCourses(coursesMap);

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
          <h2>Goals Progress</h2>
          <CircularProgressbar
            value={overallGoalProgress}
            text={`${Math.round(overallGoalProgress)}%`}
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

      <div className="goal-course-container">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal.goal_name} className="goal-section">
              <div className="goal-header">
                <h2 className="goal-title">{goal.goal_name}</h2>
                <div className="progress-wrapper goal-progress-wrapper">
                  <CircularProgressbar
                    value={goal.goal_progress}
                    text={`${goal.goal_progress}%`}
                    styles={buildStyles({
                      pathColor: '#4CAF50',
                      textColor: '#4CAF50',
                      trailColor: '#ddd',
                    })}
                  />
                </div>
              </div>

              {goalCourses[goal.goal_name]?.length > 0 ? (
                <div className="courses-grid">
                  {goalCourses[goal.goal_name].map((course) => (
                    <div
                      className="course-card"
                      key={course.cid}
                      onClick={() => navigate(course.link)}
                    >
                      <i className={`${course.icon} course-icon`}></i>
                      <h3 className="course-title">{course.course_name}</h3>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-courses">No courses assigned for this goal.</p>
              )}
            </div>
          ))
        ) : (
          <p className="no-goals">No goals registered.</p>
        )}
      </div>
    </div>
  );
};

export default Userinterface;
