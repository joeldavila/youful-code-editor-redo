// server/app.js

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
const port = 3001; // Change this to your desired port number

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your routes here
const authRoutes = require('./routes/auth');
const sessionsRoutes = require('./routes/sessions');
app.use('/auth', authRoutes);
app.use('/sessions', sessionsRoutes);

// Session and Passport initialization
app.use(session({ 
    secret: 'your-secret-key', // Replace with a strong and random secret
    resave: false,             // Don't save session data on every request, originally true
    saveUninitialized: false,  // Don't save uninitialized sessions, originally true
    cookie: { secure: false }, // Set 'secure' to true for HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});