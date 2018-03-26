const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealStr} = require('./utils/validator.js')

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
  // io.on is used to make a server connection and it returns socket as an argument which we pass to the callback.
  // 'connection ' is a built-in event.
  // you would not want to mess with its name .
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
  // socket.emit() creates a custom emit event which then gets recived by the front-end part of the app.
  // in our case the index.js file.

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))
  // socket.broadcast.emit() is used to emit events which gets recieved by all the users except one, the user which sends the data.

  // here we listen to the event .
  socket.on('join', (params, callback) => {
    if (!isRealStr(params.name) || !isRealStr(params.room)) {
      callback('Name and Room name are required')
    }

    callback();         // if there is no error, we want to call the callback function without any argument.
    // because the argument we pass is only for the error case.
  })

  socket.on('CreateMessage', (msg, callback) => {
    //console.log('msg to server', msg)
    io.emit('newMessage', generateMessage(msg.from, msg.text))
    // io.emit() is used to send the message to all the users .
    callback()
  })

  socket.on('createLocationMessage', (coords) => {
    // we emit the location to all the users connected.
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    // and similarly this event closes the server to accept connections.
    // disconnect is also a built in event.
  });
});

server.listen(8000, () => {
  console.log(`Server is up on 8000`);
});
