const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require("bcrypt");

// GET: Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// DELETE: Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId); // Delete the user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

// PUT: Update a user
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, role, image } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password, role, image },
      { new: true } // Return the updated user object
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});


// POST: Create a new user
router.post('/', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the incoming data

    const { name, email, password, role, image } = req.body;

    // Check for missing fields
    if (!name || !email || !role || !password) {
      console.error('Missing required fields:', { name, email, role, password }); // Log the missing fields
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      image,
    });

    const savedUser = await newUser.save();
    console.log('User created:', savedUser); // Log the successfully created user

    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error in POST /api/users:', error.message); // Log the error message
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Send back user role and mock token
    res.json({
      role: user.role.toLowerCase(), // Normalize the role to lowercase
      token: "mocked-jwt-token", // Replace with real JWT logic
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
