import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
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
        const response = await fetch('http://localhost:8080/auth/me', {
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

    const fetchTransactions = async () => {
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/transactions', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        } else {
          if (data.message === 'Token expired') {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
          } else {
            setError(data.message || 'Failed to fetch transactions');
          }
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchUser();
    fetchTransactions();
  }, [token, navigate]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="transactions-container">
      <div className="sidebar">
        <ul>
          {user.role === 'seller' && (
            <>
              <li><button onClick={() => navigate('/register-gold')}>Register Gold</button></li>
              <li><button onClick={() => navigate('/transfer-gold')}>Transfer Gold</button></li>
              <li><button onClick={() => navigate('/sell-gold')}>Sell Gold</button></li>
              <li><button onClick={() => navigate('/transactions')}>View Transactions</button></li>
              <li><button onClick={() => navigate('/settings')}>Settings</button></li>
            </>
          )}
          {user.role === 'buyer' && (
            <>
              <li><button onClick={() => navigate('/transactions')}>View Transactions</button></li>
              <li><button onClick={() => navigate('/settings')}>Settings</button></li>
            </>
          )}
        </ul>
      </div>
      <div className="main-content">
        <h2>Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Gold ID</th>
              <th>Transaction Type</th>
              <th>Transaction Time</th>
              {user.role === 'seller' && <th>Recipient Public Key</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.goldId}</td>
                <td>{transaction.transactionType}</td>
                <td>{new Date(transaction.transactionTime).toLocaleString()}</td>
                {user.role === 'seller' && <td>{transaction.recipientPublicKey || 'N/A'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;