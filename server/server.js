const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message')

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

  socket.on('CreateMessage', (msg) => {
    console.log('msg to server', msg)
    io.emit('newMessage', generateMessage(msg.from, msg.text))
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(8000, () => {
  console.log(`Server is up on 8000`);
});
