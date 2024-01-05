const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: String,
  roles: { type: [String], default: [] }, // 'parent', 'teacher', etc.
});

module.exports = mongoose.model('User', userSchema);
