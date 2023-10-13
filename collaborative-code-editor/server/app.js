// server/app.js

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;

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



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});