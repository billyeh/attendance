var mongoose = require('mongoose');
var dbString = require('./config').mongodbString;

mongoose.connect(process.env.NODE_ENV === 'production' ? dbString :
 'mongodb://localhost/attendance');

var Meeting = mongoose.model('Meeting', {
  category: {type: String, default: 'Other'},
  name: {type: String, default: 'Untitled Meeting'},
  locality: String,
  attendees: [{
    id: {type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId},
    fullname: String,
    category: {type: String, default: 'None'}
  }],
  instances: [{
    date: Date,
    count: {type: Number, default: 0},
    attendance: [String]
  }]
});

module.exports.Meeting = Meeting;
