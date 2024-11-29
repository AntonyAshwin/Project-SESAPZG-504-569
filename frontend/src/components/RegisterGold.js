import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GoldVerificationABI from '/Users/I528714/3rdsem/Project-SESAPZG-504-569/frontend/src/build/contracts/GoldVerification.json';

const RegisterGold = () => {
  const [weight, setWeight] = useState('');
  const [purity, setPurity] = useState('');
  const [shopId, setShopId] = useState('');
  const [goldType, setGoldType] = useState('');
  const [bisHallmark, setBisHallmark] = useState('');
  const [registrationResult, setRegistrationResult] = useState('');
  const [registeredGoldId, setRegisteredGoldId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const contractAddress = '0x4612565ab51CA13b2d8f7E7426711Ad2777a1a2C';

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
  }, [contractAddress]);

  const validateInputs = () => {
    if (weight < 0 || weight > 99999) {
      setRegistrationResult('Weight must be between 0 and 99999 grams');
      return false;
    }
    if (purity < 0 || purity > 100) {
      setRegistrationResult('Purity must be between 0 and 100 percent');
      return false;
    }
    if (shopId.length > 10) {
      setRegistrationResult('Shop ID must be a maximum of 10 characters');
      return false;
    }
    if (goldType.length > 3) {
      setRegistrationResult('Gold Type must be a maximum of 3 characters');
      return false;
    }
    if (bisHallmark.length > 6) {
      setRegistrationResult('BIS Hallmark must be a maximum of 6 characters');
      return false;
    }
    return true;
  };

  const convertToHex = (value) => {
    return web3.utils.asciiToHex(value);
  };

  const registerGold = async () => {
    if (contract && accounts.length > 0) {
      if (!validateInputs()) {
        return;
      }

      try {
        const receipt = await contract.methods.registerGold(
          parseInt(weight),
          parseInt(purity),
          convertToHex(shopId),
          convertToHex(goldType),
          convertToHex(bisHallmark)
        ).send({ from: accounts[0] });

        console.log('Transaction receipt:', receipt);
        const event = receipt.events.GoldRegistered;
        console.log('GoldRegistered event:', event);

        const goldId = event.returnValues.goldId.toString();
        const transactionHash = receipt.transactionHash;

        setRegisteredGoldId(goldId);
        setTransactionId(transactionHash);
        setRegistrationResult('Gold registered successfully');

        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setRegistrationResult('No token found. Please log in.');
          return;
        }

        // Decode the JWT token to get the userId
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Send the transaction data to the backend
        const response = await fetch('http://localhost:8080/transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({
            userId,
            goldId,
            transactionType: 'register',
            transactionHash,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setRegistrationResult(data.message || 'Failed to save transaction');
        }
      } catch (error) {
        console.error('Error registering gold:', error);
        setRegistrationResult('Error registering gold');
      }
    }
  };

  return (
    <div>
      <h2>Register Gold</h2>
      <form onSubmit={(e) => { e.preventDefault(); registerGold(); }}>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (grams)"
        />
        <input
          type="number"
          value={purity}
          onChange={(e) => setPurity(e.target.value)}
          placeholder="Purity (%)"
        />
        <input
          type="text"
          value={shopId}
          onChange={(e) => setShopId(e.target.value)}
          placeholder="Shop ID (PAN)"
        />
        <input
          type="text"
          value={goldType}
          onChange={(e) => setGoldType(e.target.value)}
          placeholder="Gold Type (e.g., 24K)"
        />
        <input
          type="text"
          value={bisHallmark}
          onChange={(e) => setBisHallmark(e.target.value)}
          placeholder="BIS Hallmark"
        />
        <button type="submit">Register Gold</button>
      </form>
      {registrationResult && (
        <div>
          <p>{registrationResult}</p>
          <p>Gold ID: {registeredGoldId}</p>
          <p>Transaction ID: {transactionId}</p>
        </div>
      )}
    </div>
  );
};

export default RegisterGold;