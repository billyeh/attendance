var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

var Meeting = require('./models').Meeting;

var app = express();
app.use(express.static('static'));
app.use(bodyParser.json());
app.get('/api/meetings/:id', function(req, res) {
  var meeting = Meeting.find({_id: req.params.id}, function(err, docs) {
    res.json(docs[0]);
  });
});
app.get('/api/meetings', function(req, res) {
  var meetings = Meeting.find({}, function(err, docs) {
    res.json(docs);
  });
});
app.post('/api/meetings', function(req, res) {
  if (!req.body._id) {
    req.body._id = new mongoose.mongo.ObjectID();
  }
  Meeting.findOneAndUpdate({_id: req.body._id}, req.body,
    {new: true, upsert: true},
    function(err, meeting) {
      res.json(meeting);
    }
  );
});
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log("Attendance app listening on port", port);
});
