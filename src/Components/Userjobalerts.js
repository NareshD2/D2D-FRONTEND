import React, { useEffect, useState } from 'react';
import Navbar1 from './Navbar1';
import apiURL from '../utils';
function Userjobalerts() {
  const [jobAlerts, setJobAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null); // Track selected job alert

  useEffect(() => {
    const fetchJobAlerts = async () => {
      try {
        const response = await fetch(`${apiURL}/Userjobalerts`);
        if (response.ok) {
          const data = await response.json();
          setJobAlerts(data);
        } else {
          console.error("Error fetching job alerts:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching job alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAlerts();
  }, []);

  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
  };

  const handleBack = () => {
    setSelectedAlert(null); // Deselect alert and return to the list view
  };

  if (loading) return <p>Loading job alerts...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Navbar1 />
      {selectedAlert ? (
        // Show the detailed view on the right side
        <div style={{ padding: '20px', width: '70%' }}>
          <button onClick={handleBack} style={{ marginBottom: '10px', padding: '5px 10px', cursor: 'pointer' }}>
            &#8592; Back
          </button>
          <h2>{selectedAlert.jobTitle}</h2>
          <p>{selectedAlert.jobDescription}</p>
          <p>{selectedAlert.companyLink}</p>
          <small>Posted on: {new Date(selectedAlert.datePosted).toLocaleString()}</small>
        </div>
      ) : (
        // Show the list of job alerts on the left side
        <div style={{ padding: '20px', width: '70%' }}>
          <h2>Job Alerts</h2>
          {jobAlerts.length > 0 ? (
            jobAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  border: '1px solid #ddd',
                  marginBottom: '10px',
                  padding: '10px',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectAlert(alert)} // Handle click on alert
              >
                <h3>{alert.jobTitle}</h3>
                <p>Posted on: {new Date(alert.datePosted).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No job alerts found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Userjobalerts;
