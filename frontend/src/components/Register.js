import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aadhaarCardNumber, setAadhaarCardNumber] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessLicense, setBusinessLicense] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      role,
      dateOfBirth,
      address,
      phoneNumber,
      aadhaarCardNumber,
      publicKey,
      pan,
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
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Aadhaar Card Number:</label>
          <input
            type="text"
            value={aadhaarCardNumber}
            onChange={(e) => setAadhaarCardNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Public Key:</label>
          <input
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            required
          />
        </div>
        <div>
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
            <div>
              <label>GSTIN:</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Business Address:</label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                required
              />
            </div>
            <div>
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