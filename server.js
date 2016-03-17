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

var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Attendance app listening on port", port);
});
