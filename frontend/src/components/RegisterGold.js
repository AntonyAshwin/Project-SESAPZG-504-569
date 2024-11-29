import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GoldVerificationABI from '../build/contracts/GoldVerification.json'; // Adjust the path as necessary
import contractAddress from '../contractAddress'; // Import the contract address
import './RegisterGold.css'; // Import the CSS file

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
        .catch(error => {
          console.error('Error fetching accounts:', error);
        });
    } else {
      console.error('Ethereum wallet not detected');
    }
  }, []);

  const validateInputs = () => {
    if (shopId.length > 15) {
      setRegistrationResult('Shop ID must be a maximum of 15 characters');
      return false;
    }
    if (goldType.length > 3) {
      setRegistrationResult('Gold Type must be a maximum of 3 characters');
      return false;
    }
    if (bisHallmark.length > 1) {
      setRegistrationResult('BIS Hallmark must be a maximum of 1 character');
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

        const event = receipt.events.GoldRegistered;
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
            transactionHash,
            weight,
            purity,
            shopId,
            goldType,
            bisHallmark
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          setRegistrationResult(`Error: ${responseData.message}`);
        }
      } catch (error) {
        console.error('Error registering gold:', error);
        setRegistrationResult('Error registering gold');
      }
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    registerGold();
  };

  return (
    <div className="register-gold-container">
      <h3>Register Gold</h3>
      {registrationResult && <p className="success-message">{registrationResult}</p>}
      <form onSubmit={handleRegister} className="register-gold-form">
        <div className="form-group">
          <label htmlFor="weight">Weight (in grams):</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="purity">Purity (%):</label>
          <input
            type="number"
            id="purity"
            value={purity}
            onChange={(e) => setPurity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="shopId">Shop ID (PAN):</label>
          <input
            type="text"
            id="shopId"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            placeholder="Shop ID (PAN)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="goldType">Gold Type (e.g., Ring):</label>
          <input
            type="text"
            id="goldType"
            value={goldType}
            onChange={(e) => setGoldType(e.target.value)}
            placeholder="Gold Type (e.g., Ring)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bisHallmark">BIS Hallmark:</label>
          <input
            type="text"
            id="bisHallmark"
            value={bisHallmark}
            onChange={(e) => setBisHallmark(e.target.value)}
            placeholder="BIS Hallmark"
            required
          />
        </div>
        <button type="submit" className="button">Register Gold</button>
      </form>
      {registrationResult && (
        <div className="registration-result">
          <p>{registrationResult}</p>
          <p>Gold ID: {registeredGoldId}</p>
          <p>Transaction ID: {transactionId}</p>
        </div>
      )}
    </div>
  );
};

export default RegisterGold;