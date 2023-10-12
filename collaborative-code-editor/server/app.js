// server/app.js

const express = require('express');
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});