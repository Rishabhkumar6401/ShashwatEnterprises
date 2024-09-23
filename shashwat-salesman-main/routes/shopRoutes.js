const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const router = express.Router();
const User = require('../models/User');

// Static login credentials
const validUsername = 'admin';
const validPassword = 'admin123';

// Middleware for session and cookie handling
router.use(cookieParser());
router.use(session({
  secret: 'your-secret-key', // Change this to a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    httpOnly: true,  // For security: ensures the cookie is accessible only by the web server
    secure: false    // Set this to true if you're using HTTPS
  }
}));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.isAdmin) {
    return next();
  } else {
    res.redirect('/');  // Redirect to login if not authenticated
  }
}

// GET - Render login page or redirect if already logged in
router.get('/', (req, res) => {
  if (req.session.isAdmin) {
    // If the user is already logged in, redirect to /shops
    return res.redirect('/shops');
  }
  res.render('login');
});

// POST - Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check login credentials
  if (username === validUsername && password === validPassword) {
    try {
      // Set session variable for admin login
      req.session.isAdmin = true;  // Mark the user as logged in
      
      // Redirect to the shops page
      res.redirect('/shops');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  } else {
    res.send('Invalid credentials');
  }
});

// GET - Render the shops page (admin only)
router.get('/shops', isAuthenticated, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    
    // Render the shops page with the fetched users
    res.render('shops', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET - Render the registration form
router.get('/register', isAuthenticated, (req, res) => {
  res.render('register'); // Render a registration form
});

// POST - Handle the registration of a new shop
router.post('/register', async (req, res) => {
  const { userName, userAddress, phoneNo, password } = req.body;

  try {
    // Check if the user with the same phone number or username already exists
    const existingUser = await User.findOne({ $or: [{ userName }, { phoneNo }] });

    if (existingUser) {
      return res.status(400).send('Shop with phone number already exists');
    }

    // Create a new user/shop
    const newUser = new User({
      userName,
      userAddress,
      phoneNo,
      password,
      role: 'user' // Default role for shop
    });

    // Save the new user/shop to the database
    await newUser.save();

    // Redirect to the shops page after successful registration
    res.redirect('/shops');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET - Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Could not log out.');
    }
    res.clearCookie('connect.sid'); // Clears the session cookie
    res.redirect('/'); // Redirects to the login page
  });
});

// GET - Handle shop card clicks and redirect with query params (admin only)
router.get('/auth/login', isAuthenticated, (req, res) => {
  const { phoneNo, password } = req.query;
  res.redirect(`http://localhost:5173/auth/login?phoneNo=${phoneNo}&password=${password}`);
});

module.exports = router;
