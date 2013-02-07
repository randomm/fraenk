var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

app.set('view engine', 'kiwi');

app.get('/', function(req, res) {
  res.render('index', {});
});

server.listen(8080);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});