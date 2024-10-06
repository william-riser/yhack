// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors middleware
const User = require('./models/user.cjs');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins (you can specify the origin if needed)
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Route to add a user
app.post('/addUser', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Simple validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Create a new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches (password hashing not shown for simplicity)
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // If successful, send back a success response (you might also send a token or session ID)
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/addReceipt', async (req, res) => {
    console.log('Request Body:', req.body); // Add this line for debugging
    const { email, score } = req.body; // Expecting email and text in the request body

    // Check if email and text are present
    if (!email || !score) {
        return res.status(400).json({ message: 'Email and text are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        console.log(user)
        // Add the receipt (receipt text) to the user's receipts array
        user.receipts.push({ score, date: new Date() });  // Assuming receipts contain 'text' and 'date'
        console.log(user.receipts)

        // Save the updated user with the new receipt
        await user.save();

        // Send success response
        res.status(201).json({ message: 'Receipt added successfully', user });
    } catch (error) {
        console.error('Error adding receipt:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
