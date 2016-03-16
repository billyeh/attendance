var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/attendance');

var Meeting = mongoose.model('Meeting', {
  category: String,
  locality: String,
  attendees: [{
    fullname: String,
    category: String
  }],
  instances: [{
    date: Date,
    attendance: [Boolean]
  }]
});

module.exports.Meeting = Meeting;
