const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const rateLimit = require('express-rate-limit'); // Import the rate limit package
const authRoutes = require('./routes/auth'); // Import auth routes
const profileRoutes = require('./routes/profile');
const getUserRoutes = require('./routes/getUser');
const transactionRoutes = require('./routes/transaction'); // Import transaction routes
const verifyGoldRoutes = require('./routes/verifyGold'); // Import verify gold routes
dotenv.config();

const app = express();
app.use(express.json()); // Parse JSON bodies

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define rate limiting for verifyGold route
const verifyGoldLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many requests from this IP, please try again after a minute'
});

// Use routes
app.use(authRoutes);  // To directly access the login and register
app.use('/profile', profileRoutes);
app.use('/user', getUserRoutes);
app.use('/transaction', transactionRoutes); // Prefix for transaction routes
app.use('/verifygold', verifyGoldLimiter, verifyGoldRoutes); // Apply rate limiting to verifyGold route

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});