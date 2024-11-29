import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GoldVerificationABI from '../build/contracts/GoldVerification.json'; // Adjust the path as necessary
import contractAddress from '../contractAddress'; // Import the contract address
import './RegisterGold.css'; // Import the CSS file
import jewelryEnum from '../localResources/jewelryEnum'; // Import the jewelryEnum dictionary
import bis from '../localResources/BisHallMark'; // Import the BisHallMark dictionary

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

    // Fetch GSTIN from the backend
    const fetchGstin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setRegistrationResult('No token found. Please log in.');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/profile', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setShopId(data.gstin);
        } else {
          setRegistrationResult(data.message || 'Failed to fetch GSTIN');
        }
      } catch (err) {
        setRegistrationResult('An error occurred. Please try again.');
      }
    };

    fetchGstin();
  }, []);

  const validateInputs = () => {
    if (weight < 0 || weight > 99999) {
      setRegistrationResult('Weight must be between 0 and 99999 grams');
      return false;
    }
    if (purity < 0 || purity > 100) {
      setRegistrationResult('Purity must be between 0 and 100 percent');
      return false;
    }
    if (!bisHallmark) {
      setRegistrationResult('Please select a BIS Hallmark');
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
          convertToHex(shopId), // Use GSTIN as shopId
          convertToHex(jewelryEnum[goldType]), // Use the value from jewelryEnum
          convertToHex(bis[bisHallmark]) // Use the value from BisHallMark
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
      <h2>Register Gold</h2>
      <form onSubmit={(e) => { e.preventDefault(); registerGold(); }}>
        <div className="form-group">
          <label htmlFor="weight">Weight (grams)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (grams)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="purity">Purity (%)</label>
          <input
            type="number"
            id="purity"
            value={purity}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 2) {
                setPurity(value);
              }
            }}
            placeholder="Purity (%)"
            maxLength="2"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shopId">Shop ID (GSTIN)</label>
          <input
            type="text"
            id="shopId"
            value={shopId}
            readOnly
            placeholder="Shop ID (GSTIN)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="goldType">Gold Type</label>
          <select
            id="goldType"
            value={goldType}
            onChange={(e) => setGoldType(e.target.value)}
          >
            <option value="">Select Gold Type</option>
            {Object.keys(jewelryEnum).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="bisHallmark">BIS Hallmark</label>
          <select
            id="bisHallmark"
            value={bisHallmark}
            onChange={(e) => setBisHallmark(e.target.value)}
          >
            <option value="">Select BIS Hallmark</option>
            {Object.keys(bis).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Register Gold</button>
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