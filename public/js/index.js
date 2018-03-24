var socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('newMessage', (msg) => {
  console.log(msg)

  // here we select the new Message and then append it to the screen.
  let li = jQuery('<li></li>')
  li.text(`${msg.from}: ${msg.text}`)

  jQuery('#messages').append(li)
})

// select the value from the form input.
jQuery('#message-form').on('submit', (event) => {
  event.preventDefault();
  //event.preventDefault() is used because , when we submit the form, we would see that the form refreshes the whole page,
  // passing the text as an url parameter.
  // but we dont want that. We want our app to load in real time.


  // then we emit an event to CreateMessage
  socket.emit('CreateMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, (msg) => {
    console.log(msg)
  })
})

socket.on('newLocationMessage', (msg) => {
  let li = jQuery('<li></li>')
  let a = jQuery('<a target="_blank">My Current Location</a>'); // target _blank sets the anchor tag to open in a new tab.
  li.text(`${msg.from}:`)
  a.attr('href', msg.url) // passing two arguments sets the second argument as the value of the first one.
  li.append(a)
  jQuery('#messages').append(li)
})

let locationbutton = jQuery('#location');
// we create a variable so that we would not have to waste time again and again.
// because if we use jQuery('#location').on twice the jQuery would be manipulating the DOM twice which would be an overkill.

locationbutton.on('click', () => {
  if (!navigator.geolocation){
    return alert('Geolocation service is not supported in your browser.')
  }

  navigator.geolocation.getCurrentPosition((position) => {
    //console.log(position)
    // we create a new event passing on the lat and long of the current user's position
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, () => {
    // this is the error case if the navigator fails.
    alert('Unable to fetch location.')
  })
})
