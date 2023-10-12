// server/routes/auth.js

const express = require('express');
const passport = require('passport');
const router = express.Router();

// Define authentication routes here
router.get('/login', (req, res) => {
    res.render('login'); // Render your login form
  });
  
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard', // Redirect on successful login
    failureRedirect: '/login',     // Redirect on failed login
    failureFlash: true,
  }));
  
  router.get('/register', (req, res) => {
    res.render('register'); // Render your registration form
  });
  
  router.post('/register', (req, res) => {
    // Handle user registration, create a new User instance, and save it to the database
  });
  
module.exports = router;
