import React, { useState, useEffect } from 'react';

const ViewAssets = () => {
  const [goldAssets, setGoldAssets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoldAssets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
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

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setGoldAssets(data.goldAssets);
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchGoldAssets();
  }, []);

  const copyToClipboard = (goldId) => {
    navigator.clipboard.writeText(goldId).then(() => {
      alert('Gold ID copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div>
      <h2>View Assets</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
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
                <button onClick={() => copyToClipboard(goldId)}>Copy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAssets;