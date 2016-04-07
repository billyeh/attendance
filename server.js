var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var url = require('url');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('meeting', function(data) {
    console.log(data);
    socket.join(data);
  });
  socket.on('meeting data', function(data) {
    console.log(data);
    socket.broadcast.to(data._id).emit('update', data);
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
