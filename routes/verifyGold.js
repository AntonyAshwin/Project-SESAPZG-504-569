const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes
const GoldVerificationABI = require('../frontend/src/build/contracts/GoldVerification.json'); // Adjust the path as necessary
const contractAddress = require('../frontend/src/contractAddress.js'); // Adjust the path as necessary

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545')); // Connect to local Ganache
const contract = new web3.eth.Contract(GoldVerificationABI.abi, "0x2E6D8c969b4eC2AE1a310D2e09B401D0620574Ee");

router.get('/:goldId', authMiddleware, async (req, res) => {
  const goldId = req.params.goldId;

  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const gold = await contract.methods.getGoldDetails(goldId).call();

    if (gold[1] === '0' || gold[2] === '0') {
      return res.status(400).json({ message: 'Invalid gold details' });
    }

    const goldDetails = {
      weight: gold[1],
      purity: gold[2],
      currentOwner: gold[3],
      initialOwner: gold[4],
      registrationDate: new Date(gold[6] * 1000).toISOString(), // Convert to ISO string
      goldType: web3.utils.hexToAscii(gold[7]), // Convert hex to ASCII
      bisHallmark: web3.utils.hexToAscii(gold[8]) // Convert hex to ASCII
    };

    res.status(200).json(goldDetails);
  } catch (error) {
    console.error('Error fetching gold details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;