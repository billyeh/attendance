var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/attendance');

var Meeting = mongoose.model('Meeting', {
  category: String,
  date: Date,
  attendees: [{fullname: String}]
});

module.exports.Meeting = Meeting;
