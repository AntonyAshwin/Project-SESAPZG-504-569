import React, { useState } from 'react';
import './VerifyGold.css';

const VerifyGold = () => {
  const [goldId, setGoldId] = useState('');
  const [goldDetails, setGoldDetails] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setGoldId(e.target.value);
  };

  const handleVerifyGold = async () => {
    const token = localStorage.getItem('token'); // Get the JWT token from localStorage
    try {
      const response = await fetch(`http://localhost:8080/v1/verifygold/${goldId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Pass the JWT token in the header
        },
      });
      if (!response.ok) {
        if (response.status === 404 || response.status === 400) {
          setError('Invalid Gold ID');
        } else {
          throw new Error('Error fetching gold details');
        }
        setGoldDetails(null);
        return;
      }
      const data = await response.json();
      setGoldDetails(data);
      setError('');
    } catch (err) {
      setError('Error fetching gold details');
      setGoldDetails(null);
    }
  };

  return (
    <div className="verify-gold-page">
      <div className="verify-gold-container">
        <h2>Verify Gold</h2>
        <input
          type="text"
          value={goldId}
          onChange={handleInputChange}
          placeholder="Enter Gold ID"
          className="verify-gold-input"
        />
        <button
          onClick={handleVerifyGold}
          className="verify-gold-button"
        >
          Verify Gold
        </button>

        {error && <p className="verify-gold-error">{error}</p>}
        {goldDetails && (
          <div className="verify-gold-details">
            <p>Weight: {goldDetails.weight}</p>
            <p>Purity: {goldDetails.purity}</p>
            <p>Current Owner: {goldDetails.currentOwner}</p>
            <p>Initial Owner: {goldDetails.initialOwner}</p>
            <p>Registration Date: {goldDetails.registrationDate}</p>
            <p>Gold Type: {goldDetails.goldType}</p>
            <p>BIS Hallmark: {goldDetails.bisHallmark}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyGold;