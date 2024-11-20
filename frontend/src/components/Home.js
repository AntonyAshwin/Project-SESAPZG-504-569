import React, { useEffect, useState } from 'react';

function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
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
          setUser(data);
        } else {
          setError(data.message || 'Failed to fetch user details');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchUserDetails();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}</p>
      <p>Address: {user.address}</p>
      <p>Phone Number: {user.phoneNumber}</p>
      <p>Aadhaar Card Number: {user.aadhaarCardNumber}</p>
      <p>Public Key: {user.publicKey}</p>
      <p>PAN: {user.pan}</p>
      {user.role === 'seller' && (
        <>
          <p>GSTIN: {user.gstin}</p>
          <p>Business Address: {user.businessAddress}</p>
          <p>Business License: {user.businessLicense}</p>
        </>
      )}
    </div>
  );
}

export default Home;