import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './table.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import apiURL from '../../utils';
const Python = () => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const navigate = useNavigate();

  // Function to extract user ID from the JWT token
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

  const userId = getUserIdFromToken(); // Get user ID from the token
  const cid = new URLSearchParams(window.location.search).get('cid'); // Get course ID from the URL
  console.log(userId,cid);

  // Fetch videos and progress data when the component mounts
  useEffect(() => {
    const fetchVideos = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const cid = queryParams.get('cid');
      const response = await fetch(`${apiURL}/api/${cid}`);
      const data = await response.json();
      setVideos(data);
     
    };

    const fetchProgress = async () => {
      try {
        const res = await fetch(`${apiURL}/progress/${userId}/${cid}`);
        const completed = await res.json();
        console.log('Fetched progress from backend:', completed); // Debugging
        setCompletedVideos(new Set(completed)); // Initialize Set with the array
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchVideos();
    fetchProgress();
  }, [cid, userId]);

  // Update progress bar when videos or completedVideos state changes
  useEffect(() => {
    const checkboxes = document.querySelectorAll('.status-checkbox');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const progressLine = document.getElementById('progress-line');
    

    function updateProgress() {
      const total = checkboxes.length;
      const checked = document.querySelectorAll('.status-checkbox:checked').length;
      const percentage = Math.round((checked / total) * 100);

      progressText.textContent = `${checked}/${total} tasks completed (${percentage}%)`;
      progressFill.style.width = `${percentage}%`;
      progressLine.style.width = `${percentage}%`;
    }

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateProgress);
    });

    updateProgress();

    return () => {
      checkboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', updateProgress);
      });
    };
  }, [videos, completedVideos]);

  // Handle checkbox change and update backend
  const handleCheckboxChange = async (video) => {
    setCompletedVideos((prev) => {
      const updated = new Set(prev);
  
      if (updated.has(video.title)) {
        updated.delete(video.title);
      } else {
        updated.add(video.title);
      }
  
      // Send updated progress to backend
      fetch(`${apiURL}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cid, completedVideos: Array.from(updated)}),
      })
        .then(res => res.json())
        .then(data => console.log('Progress updated:', data))
        .catch(error => console.error('Error updating progress:', error));
  
      return updated;
    });
  };
  

  // Extract YouTube video ID from URL
  const getYouTubeID = (url) => {
    const videoId = url.split('v=')[1].split('&')[0];
    return videoId;
  };

  return (
    <div>
      {/* Back button */}
      <button className="back-button" onClick={() => navigate('/courses')}>
        &larr; Back to Courses
      </button>

      {/* Progress bar */}
      <div className="progress-container" id="progress-container">
        <div className="progress-line" id="progress-line"></div>
        <span id="progress-text">0/{videos.length} tasks completed (0%)</span>
        <div className="progress-bar">
          <div className="progress-fill" id="progress-fill"></div>
        </div>
      </div>

      {/* Videos table */}
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Status</th>
            <th>Topic</th>
            <th>YouTube</th>
            <th>Article</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="checkbox"
                  className="status-checkbox"
                  checked={completedVideos.has(video.title)}
                  onChange={() => handleCheckboxChange(video)}
                />
              </td>
              <td>{video.title}</td>
              <td>
                <button
                  onClick={() => setActiveVideo(activeVideo === index ? null : index)}
                  className="play-button"
                >
                  <img
                    src="https://s2.googleusercontent.com/s2/favicons?domain=youtube.com"
                    className="icon"
                    alt="YouTube"
                  />
                  Play
                </button>
              </td>
              <td>-</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Video modal */}
      {activeVideo !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setActiveVideo(null)}>Close</button>
            <iframe
              width="650"
              height="515"
              src={`https://www.youtube.com/embed/${getYouTubeID(videos[activeVideo].youtubelink)}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Python;