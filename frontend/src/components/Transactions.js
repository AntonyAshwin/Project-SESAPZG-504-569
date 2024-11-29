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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options); // Use 'en-GB' for dd/mm/yyyy format
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>
      {error && <p className="error">{error}</p>}
      <table className="transactions-header">
        <thead>
          <tr>
            <th>Gold ID</th>
            <th>Transaction Type</th>
            <th>Transaction Date</th>
            <th>Transaction Time</th>
            <th>Transaction Hash</th>
            <th>Recipient Public Key</th>
          </tr>
        </thead>
      </table>
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p>No transactions are present.</p>
        ) : (
          <table>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction._id}
                  ref={transactions.length === index + 1 ? lastTransactionElementRef : null}
                >
                  <td>{transaction.goldId}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{formatDate(transaction.transactionTime)}</td>
                  <td>{formatTime(transaction.transactionTime)}</td>
                  <td>{transaction.transactionHash}</td>
                  <td>{transaction.recipientPublicKey || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Transactions;