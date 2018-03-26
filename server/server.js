const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealStr} = require('./utils/validator')
const {Users} = require('./utils/users')

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
  // io.on is used to make a server connection and it returns socket as an argument which we pass to the callback.
  // 'connection ' is a built-in event.
  // you would not want to mess with its name .
  console.log('New user connected');

  // here we listen to the event .
  socket.on('join', (params, callback) => {
    if (!isRealStr(params.name) || !isRealStr(params.room)) {
      return callback('Name and Room name are required') // to stop the execution of the program. if we catch an error.
    }

    socket.join(params.room)      // this is an event listener for when a connection happens only to a particular room.
    users.removeUser(socket.id)   // we remove the user , before adding them. Because we dont want a user of another room to
    // add a room without leaving the first one.
    users.addUser(socket.id, params.name, params.room)    // socket.id is a unique id specified to eveyr socket.

    io.to(params.room).emit('UpdateUserList', users.getUserList(params.room))
    // io.to('ROOM NAME').emit() is used to emit events which gets recieved by all the users in a given room.

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
    // socket.emit() creates a custom emit event which then gets recived by the front-end part of the app.
    // in our case the index.js file.

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`))
    // socket.broadcast.emit() is used to emit events which gets recieved by all the users except one, the user which sends the data.
    // socket.broadcast.to('ROOM NAME').emit() is used when we have to pass a message or event which gets recieved by every user
    // in the same room except the one emiiting that.

    callback();         // if there is no error, we want to call the callback function without any argument.
    // because the argument we pass is only for the error case.
  })

  socket.on('CreateMessage', (msg, callback) => {
    //console.log('msg to server', msg)

    let user = users.getUser(socket.id)
    if(user && isRealStr(msg.text)){
    io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text))
    // io.emit() is used to send the message to all the users .
    }
    callback()
  })

  socket.on('createLocationMessage', (coords) => {
    // we emit the location to all the users connected.

    let user = users.getUser(socket.id)
    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
    }
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    // and similarly this event closes the server to accept connections.
    // disconnect is also a built in event.

    // so here we need to delete the user before actually adding it.
    // so that when a user leaves teh caht room, the list gets updated.

    let user = users.removeUser(socket.id)

    if(user) {
      io.to(user.room).emit('UpdateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the conversation.`))
    }

  });
});

server.listen(8000, () => {
  console.log(`Server is up on 8000`);
});
