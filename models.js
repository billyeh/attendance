var mongoose = require('mongoose');
var dbString = require('./config').mongodbString;

mongoose.connect(process.env.NODE_ENV === 'production' ? dbString :
 'mongodb://localhost/attendance');

var Meeting = mongoose.model('Meeting', {
  category: String,
  locality: String,
  attendees: [{
    id: {type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId},
    fullname: String,
    category: {type: String, default: 'None'}
  }],
  instances: [{
    date: Date,
    attendance: [String]
  }]
});

module.exports.Meeting = Meeting;
