import React, { useState, useEffect } from 'react';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/transactions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        } else {
          setError(data.message || 'Failed to fetch transactions');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchTransactions();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (transactions.length === 0) {
    return <p>No transactions found.</p>;
  }

  return (
    <div className="container fade-in">
      <h2>Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id} className="card">
            <p>Amount: {transaction.amount}</p>
            <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
            <p>Description: {transaction.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;