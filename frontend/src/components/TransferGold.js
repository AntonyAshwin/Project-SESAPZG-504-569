import React, { useState } from 'react';
import Web3 from 'web3';
import GoldVerificationABI from '../build/contracts/GoldVerification.json'; // Adjust the path as necessary
import './TransferGold.css'; // Import the CSS file

function TransferGold() {
  const [goldId, setGoldId] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const transferOwnership = async () => {
    // Functionality remains unchanged
  };

  return (
    <div className="transfer-gold-container">
      <h2>Transfer Ownership</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={(e) => { e.preventDefault(); transferOwnership(); }} className="transfer-gold-form">
        <div className="form-group">
          <label htmlFor="goldId">Gold ID:</label>
          <input
            type="text"
            id="goldId"
            value={goldId}
            onChange={(e) => setGoldId(e.target.value)}
            placeholder="Gold ID"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newOwner">New Owner Address:</label>
          <input
            type="text"
            id="newOwner"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="New Owner Address"
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="button">Transfer</button>
      </form>
    </div>
  );
}

export default TransferGold;