var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var connection_string = 'mongodb://localhost/attendance';
if (process.env.NODE_ENV === 'production') {
  connection_string = 'mongodb://' + process.env.MONGO_USER + ':' + 
    process.env.MONGO_PASS + '@' + process.env.MONGO_IP + '/attendance';
}
mongoose.connect(connection_string);

var Meeting = mongoose.model('Meeting', {
  user: mongoose.Schema.Types.ObjectId,
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
