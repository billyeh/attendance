var mongoose = require('mongoose');
var dbString = require('./config').mongodbString;

var bcrypt = require('bcrypt-nodejs');

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

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);

module.exports.Meeting = Meeting;
module.exports.User = User;
