import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        const response = await fetch('http://localhost:8080/v1/profile', {
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
    return <p>Loading...</p>;
  }

  return (
    <div className="home-container">
      {!user ? (
        <div className="welcome-section">
          <h1>Welcome to GoldChain</h1>
          <p>Your trusted platform for managing gold transactions on the blockchain.</p>
          <div className="cta-buttons">
            <Link to="/login" className="button">Login</Link>
            <Link to="/register" className="button">Register</Link>
          </div>
        </div>
      ) : (
        <div className="user-section">
          <h1>Welcome Back, {user.name}!</h1>
          <p>Manage your profile, view transactions, register gold, and transfer gold.</p>
          <div className="cta-buttons">
            {user.role === 'seller' && (
              <>
                <button onClick={() => navigate('/register-gold')} className="button">Register Gold</button>
                <button onClick={() => navigate('/transfer-gold')} className="button">Transfer Gold</button>
                <button onClick={() => navigate('/transactions')} className="button">View Transactions</button>
              </>
            )}
            {user.role === 'buyer' && (
              <>
                <button onClick={() => navigate('/transfer-gold')} className="button">Transfer Gold</button>
                <button onClick={() => navigate('/transactions')} className="button">View Transactions</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;