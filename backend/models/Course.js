const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  answer: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: 'basic'
  },
  explanation: {
    type: String,
    default: ''
  }
});

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'basic'
  },
  quizes: [quizSchema]
});

const courseSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  days: [daySchema]
});

module.exports = mongoose.model('Course', courseSchema);