// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // You can add other fields as needed (e.g., email, roles, etc.)
});

const User = mongoose.model('User', userSchema);

module.exports = User;
