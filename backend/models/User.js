const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  completedQuizzes: [{
    course: String,
    day: String,
    score: Number,
    completedAt: Date
  }]
});

module.exports = mongoose.model('User', userSchema);