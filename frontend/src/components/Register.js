import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aadhaarCardNumber, setAadhaarCardNumber] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessLicense, setBusinessLicense] = useState('');
  const [error, setError] = useState('');
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showPan, setShowPan] = useState(false);
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setPublicKey(accounts[0]);
          setMetamaskConnected(true);
        } else {
          setPublicKey('');
          setMetamaskConnected(false);
        }
      });
    }
  }, []);

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setPublicKey(accounts[0]);
        setMetamaskConnected(true);
      } catch (err) {
        setError('Failed to connect to MetaMask');
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Phone number must be 10 digits long');
      return;
    }

    const userData = {
      email,
      password,
      name,
      role,
      address,
      phoneNumber,
      aadhaarCardNumber,
      publicKey,
      pan,
      dateOfBirth, // Add this line
      gstin: role === 'seller' ? gstin : undefined,
      businessAddress: role === 'seller' ? businessAddress : undefined,
      businessLicense: role === 'seller' ? businessLicense : undefined,
    };

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <div className="role-selection">
            <label>
              <input
                type="radio"
                value="buyer"
                checked={role === 'buyer'}
                onChange={(e) => setRole(e.target.value)}
              />
              Buyer
            </label>
            <label>
              <input
                type="radio"
                value="seller"
                checked={role === 'seller'}
                onChange={(e) => setRole(e.target.value)}
              />
              Seller
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Public Key:</label>
          <input
            type="text"
            value={publicKey}
            readOnly
            required
          />
          {!metamaskConnected && (
            <button type="button" onClick={connectMetamask} className="connect-metamask-button">
              Connect MetaMask
            </button>
          )}
        </div>
        <div className="form-group">
          <label>PAN:</label>
          <div className="input-with-toggle">
            <input
              type={showPan ? 'text' : 'password'}
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPan(!showPan)}
              className="toggle-button"
            >
              {showPan ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>Aadhaar Card Number:</label>
          <div className="input-with-toggle">
            <input
              type={showAadhaar ? 'text' : 'password'}
              value={aadhaarCardNumber}
              onChange={(e) => setAadhaarCardNumber(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowAadhaar(!showAadhaar)}
              className="toggle-button"
            >
              {showAadhaar ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {role === 'seller' && (
          <>
            <div className="form-group">
              <label>GSTIN:</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Business Address:</label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Business License:</label>
              <input
                type="text"
                value={businessLicense}
                onChange={(e) => setBusinessLicense(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;