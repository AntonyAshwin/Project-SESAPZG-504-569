import React, { useState } from 'react';

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
      const response = await fetch(`http://localhost:8080/verifygold/${goldId}`, {
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
    <div>
      <input
        type="text"
        value={goldId}
        onChange={handleInputChange}
        placeholder="Enter Gold ID"
      />
      <button onClick={handleVerifyGold} disabled={goldId.length !== 77}>
        Verify Gold
      </button>

      {error && <p>{error}</p>}
      {goldDetails && (
        <div>
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
  );
};

export default VerifyGold;