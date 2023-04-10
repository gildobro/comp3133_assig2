const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    // Check if username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    // Save user to the database
    const savedUser = await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Check if user exists in the database
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({ message: "Logged in successfully", token: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
