const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // Import auth routes
const dashboardRoutes = require('./routes/dashboard');

dotenv.config();

const app = express();
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Use authentication routes
app.use('/auth', authRoutes); // Prefix for auth routes
app.use('/dashboard', dashboardRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
