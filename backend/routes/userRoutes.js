const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendEmail = require('../mailer'); // Import the sendEmail function

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

    // Update the user with the provided data
    // No hashing here, the plain password will be stored
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password, role, image }, // Store plain password
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

const bcrypt = require('bcrypt'); // Import bcrypt

// POST: Create a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, image } = req.body;

    // Check for missing fields
    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Send a welcome email with the plain password
    const subject = 'Welcome to Our App!';
    const text = `Hello ${name},\n\nWelcome to our app!\n\nHere are your account details:\nEmail: ${email}\nPassword: ${password}\n\nBest regards,\nYour App Team`;

    try {
      await sendEmail(email, subject, text);
      console.log('Welcome email sent to:', email);
    } catch (err) {
      console.error('Error sending welcome email:', err);
      return res.status(500).json({ message: 'Failed to send welcome email', error: err.message });
    }

    // Hash the password after sending the email
    const saltRounds = 10; // Define the number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      role,
      image,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User created successfully and email sent',
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, role: savedUser.role },
    });
  } catch (error) {
    console.error('Error in POST /api/users:', error.message); // Log the error message
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// POST: Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Return the user role upon successful login
    res.json({
      role: user.role.toLowerCase(), // Normalize the role to lowercase
      message: "Login successful",
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
module.exports = router;
