import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GoldVerificationABI from '/Users/I528714/3rdsem/Project-SESAPZG-504-569/frontend/src/build/contracts/GoldVerification.json';

const TransferOwnership = () => {
  const [goldId, setGoldId] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [transferResult, setTransferResult] = useState('');
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const contractAddress = '0x3f2240b02ceac2bDeb0a50F71B4efD585365D524';

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

  const transferOwnership = async () => {
    if (contract && accounts.length > 0) {
      try {
        await contract.methods.transferOwnership(goldId, newOwner).send({ from: accounts[0] });
        setTransferResult('Ownership transferred successfully');
      } catch (error) {
        console.error('Error transferring ownership:', error);
        setTransferResult('Error transferring ownership');
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