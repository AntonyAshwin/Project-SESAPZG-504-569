import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import './Home.css';

function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/profile', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          if (data.message === 'Token expired') {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            setError(data.message || 'Failed to fetch user data');
          }
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchUser();
  }, [token, navigate]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="home-container">
      <div className="sidebar">
        <ul>
          {user.role === 'seller' && (
            <>
              <li><Link to="/register-gold">Register Gold</Link></li>
              <li><Link to="/transfer-gold">Transfer Gold</Link></li>
              <li><Link to="/transactions">View Transactions</Link></li>
            </>
          )}
          {user.role === 'buyer' && (
            <>
              <li><Link to="/transfer-gold">Transfer Gold</Link></li>
              <li><Link to="/transactions">View Transactions</Link></li>
            </>
          )}
          <li><Link to="/verify-gold">Verify Gold</Link></li> {/* New tile for both buyers and sellers */}
        </ul>
      </div>
      <div className="main-content">
        <h1>Welcome Back, {user.name}!</h1>
        <p>Manage your profile, view transactions, register gold, and transfer gold.</p>
        {/* Add widgets here */}
      </div>
    </div>
  );
}

export default Home;