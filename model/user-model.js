const mongoose = require('mongoose');

const User = mongoose.model('User', {
  pseudo: String,
  email: String,
  password: String,
  role: String
});

module.exports = User;