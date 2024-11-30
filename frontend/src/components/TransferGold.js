import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GoldVerificationABI from '../build/contracts/GoldVerification.json'; // Adjust the path as necessary
import contractAddress from '../contractAddress'; // Import the contract address

const TransferOwnership = () => {
  const [goldId, setGoldId] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [transferResult, setTransferResult] = useState('');
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccounts(accounts);
          const contractInstance = new web3Instance.eth.Contract(GoldVerificationABI.abi, contractAddress);
          setContract(contractInstance);
        })
        .catch(err => console.error(err));
    } else {
      console.error('MetaMask is not installed');
    }
  }, []);

  const transferOwnership = async () => {
    if (contract && accounts.length > 0) {
      try {
        const receipt = await contract.methods.transferOwnership(goldId, newOwner).send({ from: accounts[0] });
        setTransferResult('Ownership transferred successfully');

        const event = receipt.events.GoldTransferred;
        const transactionHash = receipt.transactionHash;
        const goldIdFromEvent = event.returnValues.goldId;

        console.log('Transaction Hash:', transactionHash);

        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setTransferResult('No token found. Please log in.');
          return;
        }

        // Decode the JWT token to get the userId
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Send the transaction data to the backend
        const response = await fetch('http://localhost:8080/v1/transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({
            userId,
            goldId: goldIdFromEvent.toString(), // Convert BigInt to string
            transactionType: 'transfer',
            transactionHash,
            recipientPublicKey: newOwner,
            isSuccessful: true,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setTransferResult(data.message || 'Failed to save transaction');
        }
      } catch (error) {
        console.error('Error transferring ownership:', error);
        setTransferResult('Error transferring ownership');

        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setTransferResult('No token found. Please log in.');
          return;
        }

        // Decode the JWT token to get the userId
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Send the transaction data to the backend with isSuccessful as false
        await fetch('http://localhost:8080/v1/transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({
            userId,
            goldId: goldId.toString(), // Convert BigInt to string
            transactionType: 'transfer',
            transactionHash: 'N/A',
            recipientPublicKey: newOwner,
            isSuccessful: false,
          }),
        });
      }
    }
  };

  return (
    <div>
      <h2>Transfer Ownership</h2>
      <form onSubmit={(e) => { e.preventDefault(); transferOwnership(); }}>
        <input
          type="text"
          value={goldId}
          onChange={(e) => setGoldId(e.target.value)}
          placeholder="Gold ID"
        />
        <input
          type="text"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          placeholder="New Owner Address"
        />
        <button type="submit">Transfer Ownership</button>
      </form>
      {transferResult && <p>{transferResult}</p>}
    </div>
  );
};

export default TransferOwnership;