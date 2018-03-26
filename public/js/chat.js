var socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

  // we create an emit event to join a room. We want the users to join a particular room and chat only to the users, of that room.
  // also , we would want to validate if the user and room name is provided and real. So,
  let params = jQuery.deparam(window.location.search)

  socket.emit('join', params, (err) => {
    if (err) {
      alert(err)
      window.location.href = '/';       // we redirect them to the home page if the credentials are invalid.
    } else {
      console.log('No error');          // else for the time being we console log the message if there is no error.
    }
  })

});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('UpdateUserList', (users) => {
  let ol = jQuery('<ol id="myOl"></ol>')

  users.forEach((user) => {
    ol.append(jQuery('<li class="card"></li>').text(user));
  })

  jQuery('#users').html(ol)
})

socket.on('newMessage', (msg) => {
  console.log(msg)
  let formattedTime = moment(msg.createdAt).format('h:mm a')
  // here we select the new Message and then append it to the screen.
  let li = jQuery('<li></li>')
  li.html(
    `<div class='container'>
        <div class='card'>
            <div class='card-body'>
                <b>${msg.from}</b> <label><span class='badge'>${formattedTime}</span></label> <br> ${msg.text}
            </div>
        </div>
      </div>
    `)

  jQuery('#messages').append(li)
})

// select the value from the form input.
jQuery('#message-form').on('submit', (event) => {
  event.preventDefault();
  //event.preventDefault() is used because , when we submit the form, we would see that the form refreshes the whole page,
  // passing the text as an url parameter.
  // but we dont want that. We want our app to load in real time.

  let messageBox = jQuery('[name=message]')

  // then we emit an event to CreateMessage
  socket.emit('CreateMessage', {
    text: messageBox.val()
  }, () => {
    messageBox.val('') // to set the value to an empty string after the message has been sent
  })
})

socket.on('newLocationMessage', (msg) => {
  let formattedTime = moment(msg.createdAt).format('h:mm a')
  let li = jQuery('<li></li>')
  let a = jQuery('<a target="_blank">My Current Location</a>'); // target _blank sets the anchor tag to open in a new tab.
  li.html(`
    <div class='container'>
      <div class='card'>
          <div class='card-body'>
              <b>${msg.from}</b> <label><span class='badge'>${formattedTime}</span></label><br> <br>
          </div>
      </div>
    </div>
    `)
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

  locationbutton.attr('disabled', 'disabled').text('Sending Location...')
  // Disable the button while the location is being sent and change the text.

  navigator.geolocation.getCurrentPosition((position) => {
    //console.log(position)
    // we create a new event passing on the lat and long of the current user's position

    locationbutton.removeAttr('disabled').text('Send Location')
    // to remove the disbaled attribute and change the text back to normal.

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, () => {
    // this is the error case if the navigator fails.
    locationbutton.removeAttr('disabled').text('Send Location')
    alert('Unable to fetch location.')
  })
})
