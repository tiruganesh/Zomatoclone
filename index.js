// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
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

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
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
app.get('/', async (req, res) => {
    res.send("<h1 align=center>Welcome to the backend </h1>");
});

// API Registration
app.post('/register', async (req, res) => {
    const { user, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ user, email, password: hashPassword });
        await newUser.save();

        console.log("New user registered successfully...");
        res.json({ message: 'User created successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// API Login with JWT
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate Token
        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: "Login Successful", username: user.user, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Protected Route Example
app.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: "Welcome to your dashboard!", user: req.user });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
