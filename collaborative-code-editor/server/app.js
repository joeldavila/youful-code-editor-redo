// server/app.js

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const helmet = require('helmet');

const app = express();
const port = 3001; // Change this to your desired port number

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key', // Replace with a strong, random secret
    resave: false,
    saveUninitialized: false
  }));

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

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
  // Add more users as needed
];

passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = users.find(u => u.username === username);

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
}));
  
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
}

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.send('Welcome to the dashboard!');
});

const sessions = [];

class CodeEditingSession {
    constructor(sessionName, code, creator) {
        this.id = sessions.length + 1;
        this.sessionName = sessionName;
        this.code = code;
        this.creator = creator;
        this.participants = [creator]; // Add the creator to the participants
        this.permissions = { edit: [creator] }; // Initial permissions for the creator
    }
    // Add a user to the session with edit permissions
    addUserWithEditPermission(user) {
        this.participants.push(user);
        this.permissions.edit.push(user);
    }
    // Remove edit permission from a user
    removeEditPermission(user) {
        const userIndex = this.permissions.edit.indexOf(user);
        if (userIndex !== -1) {
            this.permissions.edit.splice(userIndex, 1);
        }
    }
    // Check if a user has edit permission
    hasEditPermission(user) {
        return this.permissions.edit.includes(user);
    }
}

// Other imports and configurations for your Express app

// Your routes and other application code

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

// Create a new session
app.post('/sessions/create', ensureAuthenticated, (req, res) => {
    const { sessionName, code } = req.body;
    const newSession = new CodeEditingSession(sessionName, code, req.user);
  
    sessions.push(newSession);
    res.redirect('/dashboard');
});
  
// Join an existing session
app.get('/sessions/:id/join', ensureAuthenticated, (req, res) => {
    const sessionId = parseInt(req.params.id);
    const session = sessions.find((s) => s.id === sessionId);
  
    if (session) {
      session.participants.push(req.user);
      res.redirect(`/sessions/${sessionId}`);
    } else {
      res.redirect('/dashboard');
    }
});
  
// Edit a session
app.post('/sessions/:id/edit', ensureAuthenticated, (req, res) => {
    const sessionId = parseInt(req.params.id);
    const session = sessions.find((s) => s.id === sessionId);
  
    if (session && session.permissions.edit.includes(req.user)) {
      session.code = req.body.code;
      res.redirect(`/sessions/${sessionId}`);
    } else {
      res.redirect('/dashboard');
    }
});

// Display session
app.get('/sessions/:id', ensureAuthenticated, (req, res) => {
    const sessionId = parseInt(req.params.id);
    const session = sessions.find((s) => s.id === sessionId);
  
    if (session) {
      res.render('session', { session });
    } else {
      res.redirect('/dashboard');
    }
});

// Registration route
app.post('/register', [
    check('username').isLength({ min: 3 }).trim().escape(),
    check('password').isLength({ min: 6 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  
    const { username, password } = req.body;
  
    // Hash the password securely using bcrypt
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
      
      // Store the username and hashed password in your database
      // Ensure to sanitize inputs when inserting into the database
  
        res.status(201).json({ message: 'Registration successful' });
    });
});
  


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.json());
app.use(helmet());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});