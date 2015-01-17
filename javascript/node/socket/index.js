'use strict';

var fs = require('fs');
var http = require('http');
var socketio = require('socket.io');

var server = http.createServer(function(req, res) {
  fs.readFile('index.html', function(err, data) {
    if (err) throw err;
    res.end(data);
  })
});

var io = socketio(server);
io.on('connection', function(socket) {
  console.log('connected');
});

server.listen(8001);
