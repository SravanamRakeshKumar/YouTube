const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  firstVisit: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  visitCount: {
    type: Number,
    default: 1
  },
  userAgent: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Update lastVisit timestamp before saving
visitorSchema.pre('save', function(next) {
  this.lastVisit = new Date();
  next();
});

module.exports = mongoose.model('Visitor', visitorSchema);








// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   joinedAt: {
//     type: Date,
//     default: Date.now
//   },
//   completedQuizzes: [{
//     course: String,
//     day: String,
//     score: Number,
//     completedAt: Date
//   }]
// });

// module.exports = mongoose.model('User', userSchema);