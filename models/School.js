const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String,
  inviteCode: String,
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('School', schoolSchema);
