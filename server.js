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

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'secret', 
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(auth);
app.use(express.static('static'));

function auth(req, res, next) {
  console.log(req.url);
  var staticFiles = ['/login', '/bootstrap.css', '/bundle.js'];
  if (req.user || staticFiles.indexOf(req.url) >= 0) {
    next();
  } else {
    res.redirect('/login');
  }
}

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

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Attendance app listening on port", port);
});
