var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var url = require('url');

var Meeting = require('./src/server/models').Meeting;

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
  socket.on('meeting', function(data) {
    socket.join(data);
    io.sockets.in(data).emit('num users', io.sockets.adapter.rooms[data].length);
    socket.on('disconnect', function() {
      var clients = io.sockets.adapter.rooms[data] || [];
      io.sockets.in(data).emit('num users', clients.length);
    });
 });
  socket.on('meeting data', function(data) {
    var id = data._id;
    socket.broadcast.to(id).emit('update', data);
    delete data._id;
    delete data.__v;
    Meeting.post(id, data, function() {});
  });
  socket.on('leave meeting', function(data) {
    socket.leave(data);
    var clients = io.sockets.adapter.rooms[data] || [];
    io.sockets.in(data).emit('num users', clients.length);
  });
});

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
app.use(express.static(path.join(__dirname, 'static')));

function auth(req, res, next) {
  var staticFiles = ['/signup', '/login', '/bootstrap.css', '/bundle.js'];
  if (req.user || staticFiles.indexOf(url.parse(req.url).pathname) >= 0) {
    next();
  } else {
    res.redirect('/login');
  }
}

require('./src/server/routes')(app);
require('./src/server/passport')(passport);

var server = http.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Attendance app listening on port", port);
});
