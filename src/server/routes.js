var path = require('path');
var url = require('url');
var mongoose = require('mongoose');
var passport = require('passport');

var Meeting = require('./models').Meeting;

module.exports = function(app) {

  /******
  * API *
  ******/

  app.delete('/api/meetings/:id', function(req, res) {
    Meeting.remove({_id: req.params.id}, function(err, docs) {
      res.status(200).send('deleted');
    });
  });

  app.get('/api/meetings/:id', function(req, res) {
    var meeting = Meeting.find({_id: req.params.id, user: req.user._id}, 
      function(err, docs) {
        try {
          res.json(docs[0]);
        } catch (e) {
          res.send(e);
        }
      }
    );
  });

  app.get('/api/meetings', function(req, res) {
    var meetings = Meeting.find({user: req.user._id}, function(err, docs) {
      res.json(docs);
    });
  });

  app.post('/api/meetings', function(req, res) {
    var id = req.body._id || new mongoose.mongo.ObjectID();
    delete req.body._id;
    delete req.body.__v;
    req.body.user = req.user._id;
    var callback = (function() {
      return function(err, meeting) {
        if (err) {
          res.send(err);
        } else {
          res.json(meeting);
        }
      };
    })();
    Meeting.post(id, req.body, callback);
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: url.format({pathname: '/login', 
      query: {message: 'Sign up successful! Please enter your username and password.'}}),
    failureRedirect: url.format({pathname: '/signup',
      query: {error: 'Error signing up.'}}),
    failureFlash: true
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: url.format({pathname: '/login', 
      query: {error: 'Error logging in.'}}),
    failureFlash: true
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../static', 'index.html'));
  });
}; 
