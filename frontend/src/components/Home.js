import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  return (
    <div className="home-container">
      {!isAuthenticated ? (
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
          <h1>Welcome Back!</h1>
          <p>Manage your profile, view transactions, register gold, and transfer gold.</p>
        </div>
      )}
    </div>
  );
}

export default Home;