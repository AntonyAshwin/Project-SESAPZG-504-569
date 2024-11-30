import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    oldPassword: '',
    address: '',
    phoneNumber: '',
    publicKey: '',
    aadhaarCardNumber: '',
    pan: '',
    gstin: '',
    businessAddress: '',
    businessLicense: '',
  });
  const [showModal, setShowModal] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setShowErrorModal(true);
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
          setFormData({
            name: data.name,
            email: data.email,
            password: '',
            oldPassword: '',
            address: data.address,
            phoneNumber: data.phoneNumber,
            publicKey: data.publicKey,
            aadhaarCardNumber: data.aadhaarCardNumber,
            pan: data.pan,
            gstin: data.gstin,
            businessAddress: data.businessAddress,
            businessLicense: data.businessLicense,
          });
        } else {
          if (data.message === 'Token expired') {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('token');
            setShowErrorModal(true);
          } else {
            setError(data.message || 'Failed to fetch profile');
            setShowErrorModal(true);
          }
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
        setShowErrorModal(true);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setShowErrorModal(true);
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(data);
        setError('Profile updated successfully');
        setShowModal('');
        navigate('/profile');
      } else {
        setError(data.message || 'Failed to update profile');
        setShowErrorModal(true);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setShowErrorModal(true);
    }
  };

  const verifyOldPassword = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setShowErrorModal(true);
      return false;
    }
    try {
      const response = await fetch('http://localhost:8080/profile/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ oldPassword: formData.oldPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        return true;
      } else {
        setError(data.message || 'Old password is incorrect');
        setShowErrorModal(true);
        return false;
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setShowErrorModal(true);
      return false;
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const isOldPasswordCorrect = await verifyOldPassword();
    if (isOldPasswordCorrect) {
      handleSubmit(e, 'password');
    }
  };

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        // Check if the user already has an account
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  
        if (accounts.length === 0) {
          // If no accounts, request permission to access accounts
          const newAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setFormData({ ...formData, publicKey: newAccounts[0] });
        } else {
          setFormData({ ...formData, publicKey: accounts[0] });
        }
      } catch (err) {
        console.log(err);
        setError('Failed to connect to MetaMask');
        setShowErrorModal(true);
      }
    } else {
      setError('MetaMask is not installed');
      setShowErrorModal(true);
    }
  };  
  
  const closeErrorModal = () => {
    setShowErrorModal(false);
    if (error === 'No token found. Please log in.' || error === 'Session expired. Please log in again.') {
      navigate('/login');
    }
  };

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Profile</h2>
        <div className="profile-details">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
          <p><strong>Public Key:</strong> {profile.publicKey}</p>
          <p><strong>Date of Birth:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Aadhaar Card Number:</strong> {profile.aadhaarCardNumber}</p>
          <p><strong>PAN:</strong> {profile.pan}</p>
          {profile.role === 'seller' && (
            <>
              <p><strong>GSTIN:</strong> {profile.gstin}</p>
              <p><strong>Business Address:</strong> {profile.businessAddress}</p>
              <p><strong>Business License:</strong> {profile.businessLicense}</p>
            </>
          )}
        </div>
        <div className="button-group">
          <button onClick={() => setShowModal('details')}>Update User Details</button>
          <button onClick={() => setShowModal('uuids')}>Update User UUIDs</button>
          <button onClick={() => setShowModal('password')}>Update Password</button>
        </div>
      </div>

      {showModal === 'details' && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal('')}>&times;</span>
            <form onSubmit={(e) => handleSubmit(e, 'details')}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Public Key:</label>
                <input
                  type="text"
                  name="publicKey"
                  value={formData.publicKey}
                  readOnly
                />
                <button type="button" onClick={connectMetaMask}>
                  Connect MetaMask
                </button>
              </div>
              <button type="submit">Update Details</button>
            </form>
          </div>
        </div>
      )}

      {showModal === 'uuids' && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal('')}>&times;</span>
            <form onSubmit={(e) => handleSubmit(e, 'uuids')}>
              <div className="form-group">
                <label>Aadhaar Card Number:</label>
                <input
                  type="text"
                  name="aadhaarCardNumber"
                  value={formData.aadhaarCardNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>PAN:</label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  required
                />
              </div>
              {profile.role === 'seller' && (
                <>
                  <div className="form-group">
                    <label>GSTIN:</label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Business Address:</label>
                    <input
                      type="text"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Business License:</label>
                    <input
                      type="text"
                      name="businessLicense"
                      value={formData.businessLicense}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
              <button type="submit">Update UUIDs</button>
            </form>
          </div>
        </div>
      )}

      {showModal === 'password' && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal('')}>&times;</span>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Old Password:</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Update Password</button>
            </form>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeErrorModal}>&times;</span>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;