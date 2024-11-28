import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchTransactions = async (page) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/transaction?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTransactions((prevTransactions) => [...prevTransactions, ...data.transactions]);
        setHasMore(page < data.pagination.totalPages);
      } else {
        setError(data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const lastTransactionElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>
      {error && <p className="error">{error}</p>}
      <div className="transactions-list">
        {transactions.map((transaction, index) => (
          <div
            key={transaction._id}
            className="transaction"
            ref={transactions.length === index + 1 ? lastTransactionElementRef : null}
          >
            <p><strong>Gold ID:</strong> {transaction.goldId}</p>
            <p><strong>Transaction Type:</strong> {transaction.transactionType}</p>
            <p><strong>Transaction Time:</strong> {new Date(transaction.transactionTime).toLocaleString()}</p>
            <p><strong>Transaction Hash:</strong> {transaction.transactionHash}</p>
            {transaction.recipientPublicKey && (
              <p><strong>Recipient Public Key:</strong> {transaction.recipientPublicKey}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transactions;