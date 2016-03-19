var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var passport = require('passport');
var flash = require('connect-flash');
var Meeting = require('./models').Meeting;

require('./src/config/passport')(passport);

var app = express();

app.use(express.static('static'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser());
app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.delete('/api/meetings/:id', function(req, res) {
  Meeting.remove({_id: req.params.id}, function(err, docs) {
    res.status(200).send('deleted');
  });
});
app.get('/api/meetings/:id', function(req, res) {
  var meeting = Meeting.find({_id: req.params.id}, function(err, docs) {
    try {
      res.json(docs[0]);
    } catch (e) {
      res.send(e);
    }
  });
});
app.get('/api/meetings', function(req, res) {
  var meetings = Meeting.find({}, function(err, docs) {
    res.json(docs);
  });
});
app.post('/api/meetings', function(req, res) {
  var id = req.body._id || new mongoose.mongo.ObjectID();
  delete req.body._id;
  delete req.body.__v;
  Meeting.findOneAndUpdate({_id: id}, req.body,
    {new: true, upsert: true},
    function(err, meeting) {
      if (err) {
        res.send(err)
      } else {
        res.json(meeting);
      }
    }
  );
});
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// app.post('/login')

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup',
  failureFlash: true
}));

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}


var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Attendance app listening on port", port);
});
