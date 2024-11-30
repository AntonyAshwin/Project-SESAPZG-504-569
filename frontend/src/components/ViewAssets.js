import React, { useState, useEffect } from 'react';
import './ViewAssets.css'; // Import the CSS file

const ViewAssets = () => {
  const [goldAssets, setGoldAssets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch assets from the server
    const fetchAssets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/v1/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        const data = await response.json();
        setGoldAssets(data.goldAssets);
      } catch (error) {
        setError('Error fetching assets');
      }
    };

    fetchAssets();
  }, []);

  const copyToClipboard = (goldId) => {
    navigator.clipboard.writeText(goldId);
    alert('Gold ID copied to clipboard');
  };

  return (
    <div className="view-assets-container">
      <h2>View Assets</h2>
      {error && <p className="view-assets-error">{error}</p>}
      <table className="view-assets-table">
        <thead>
          <tr>
            <th>Gold ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {goldAssets.map((goldId, index) => (
            <tr key={index}>
              <td>{goldId}</td>
              <td>
                <button className="view-assets-button" onClick={() => copyToClipboard(goldId)}>Copy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAssets;