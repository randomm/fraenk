
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , randomstring = require('randomstring')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// starting socket.io
var io = require('socket.io').listen(server)
io.sockets.on('connection', function (socket) {

  // check if this is the sole connection
  // if it is then we have to create fraenks and 
  // start the play
  if (io.sockets.clients().length == 1) {
    fraenks = get_fraenks(10);
  }
  // then send fraenks to client
  socket.emit('fraenks', fraenks);

  // handlers
  socket.on('ping', function (data) { // respond to ping
    socket.emit('pong', data);
  });

  
  socket.on('kill', function(data) {
    var killed;
    for (var i=0; i<fraenks.length; i++) {
      if (fraenks[i]['id'] == data) {
        killed = fraenks.splice(i, 1);
        break;
      }
    }
    socket.broadcast.emit('kill', killed);
    if (fraenks.length == 0) {
      fraenks = get_fraenks(10);
      socket.emit('fraenks', fraenks);
      socket.broadcast.emit('fraenks', fraenks);
    }
  });
  
});

function get_fraenks(len) {
  var f = [];
  for (var i=0; i<len; i++) {
    f.push({'id' : randomstring.generate()});
    // add other properties here
  }
  return f;
}

