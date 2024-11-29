import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Home from './components/Home';
import Transactions from './components/Transactions';
import RegisterGold from './components/RegisterGold';
import TransferGold from './components/TransferGold';
import VerifyGold from './components/VerifyGold'; // Import the new component
import { FaSun, FaMoon } from 'react-icons/fa';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.body.classList.toggle('dark-mode', savedDarkMode);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/transactions">Transactions</Link>
              </li>
              <li>
                <Link to="/register-gold">Register Gold</Link>
              </li>
              <li>
                <Link to="/verify-gold">Verify Gold</Link> 
              </li>
              <li>
                <button onClick={handleSignOut}>Sign Out</button>
              </li>
            </>
          )}
          <li>
            <button onClick={toggleDarkMode} className="dark-mode-toggle">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/register-gold" element={<RegisterGold />} />
        <Route path="/transfer-gold" element={<TransferGold />} />
        <Route path="/verify-gold" element={<VerifyGold />} /> {/* New Route */}
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}