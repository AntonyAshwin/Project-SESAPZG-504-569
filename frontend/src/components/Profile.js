import React, { useEffect, useState } from 'react';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
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
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Profile</h2>
        <p>Name: {profile.name}</p>
        <p>Email: {profile.email}</p>
        <p>Role: {profile.role}</p>
        {/* Add more profile details as needed */}
      </div>
    </div>
  );
}

export default Profile;