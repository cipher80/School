const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: String,
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});

module.exports = mongoose.model('Student', studentSchema);
