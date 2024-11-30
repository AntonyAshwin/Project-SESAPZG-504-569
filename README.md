# Project-SESAPZG-504-569  (A Blockchain Approach to Gold Provenance and Verification)

Hi All, This is our combined final project assignment for the courses 24_SESAPZG504 and 24_SESAPZG569. Our team consists of 4 members, Anthony Ashiwin(2023sl93002), Abhishek Bantiya(2023sl93003), 
Abani Kaur Kohli(2023sl93056), Suyash Triipathi(2023sl93048).

Project Introduction-
Gold, as a valuable commodity, faces numerous challenges in ensuring its authenticity, ethical sourcing, and traceability. Traditional verification methods often lack transparency and are susceptible to fraud. Blockchain technology offers a transformative solution by creating a decentralized, immutable, and transparent system for gold provenance and verification.

HOW TO LOCALLY RUN IT 

Here’s a concise breakdown of the steps:

1. Install Dependencies 
   - Use `npm install` to set up all necessary project dependencies, including blockchain-related libraries.

2. Install Ganache
   - Install Ganache, a blockchain emulator, using `npm install -g ganache` (or download the desktop app).  
   - Start Ganache to create a local blockchain for development and testing.

3. Set Up MetaMask [Uploading ModuleDecomposition.drawio…]()

   - Install the MetaMask browser extension and create/import a wallet.  
   - Configure MetaMask to connect to Ganache by adding a custom RPC network using the Ganache RPC URL (e.g., `http://127.0.0.1:7545`).  

4. Link Ganache and MetaMask  
   - Copy an account private key from Ganache and import it into MetaMask to connect your wallet with the local blockchain.  

5. Add Environment Variables  
   - Create a `.env` file to securely store sensitive variables like MongoDB connection URIs or API keys.  
   - Example `.env` file:  
     ```plaintext
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
     ```

6. Start the Project
   - Run `npm start` to launch the project. It will connect the backend to MongoDB and integrate blockchain functionality.

Now you’re ready to interact with the blockchain-based project locally!









