import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import LoadingSpinner from './LoadingSpinner';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login');
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
        } else {
          if (data.message === 'Token expired') {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            setError(data.message || 'Failed to fetch profile');
          }
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!profile) {
    return <LoadingSpinner />;  }

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Profile</h2>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Address:</strong> {profile.address}</p>
        <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
        <p><strong>Aadhaar Card Number:</strong> {profile.aadhaarCardNumber}</p>
        <p><strong>Public Key:</strong> {profile.publicKey}</p>
        {profile.role === 'seller' && (
          <>
            <p><strong>GSTIN:</strong> {profile.gstin}</p>
            <p><strong>Business Address:</strong> {profile.businessAddress}</p>
            <p><strong>Business License:</strong> {profile.businessLicense}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;