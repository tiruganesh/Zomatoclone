// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Change this in production

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (like login.html, home.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB connected successfully..."))
.catch((err) => console.log(err));

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// API Landing Page
app.get('/', (req, res) => {
    res.send("<h1 align=center>Welcome to the backend and Week 2</h1>");
});

// API Registration
app.post('/register', async (req, res) => {
    const { user, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ user, email, password: hashPassword });
        await newUser.save();

        console.log("New user registered successfully...");
        // Send JSON response instead of redirect
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// API Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        console.log("Login successful...");
        // Redirect to home page
        res.redirect(303, '/home.html');
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Protected Route Example
app.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: "Welcome to your dashboard!", user: req.user });
});

// Test route to create a new user (for testing purposes)
// This should be removed or protected in production
app.post('/test-register', async (req, res) => {
    const { user, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ user, email, password: hashPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

