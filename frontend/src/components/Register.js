import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [role, setRole] = useState('buyer');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [aadhaarCardNumber, setAadhaarCardNumber] = useState('');
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessLicense, setBusinessLicense] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      role,
      address,
      phoneNumber,
      aadhaarCardNumber,
      publicKey,
      pan,
      dateOfBirth,
      gstin: role === 'seller' ? gstin : undefined,
      businessAddress: role === 'seller' ? businessAddress : undefined,
      businessLicense: role === 'seller' ? businessLicense : undefined,
    };

    try {
      const response = await fetch('http://localhost:8080/register', {
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

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setPublicKey(accounts[0]);
      } catch (err) {
        setError('Failed to connect to MetaMask');
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
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
          <label>Aadhaar Card Number:</label>
          <input
            type="text"
            value={aadhaarCardNumber}
            onChange={(e) => setAadhaarCardNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>PAN:</label>
          <input
            type="text"
            value={pan}
            onChange={(e) => setPan(e.target.value)}
            required
          />
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
        <div className="form-group">
          <label>Public Key:</label>
          <input
            type="text"
            value={publicKey}
            readOnly
          />
          <button type="button" onClick={connectMetaMask}>
            Connect MetaMask
          </button>
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Register;
