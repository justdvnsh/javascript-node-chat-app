const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(8000, () => {
  console.log(`Server is up on 8000`);
});
