let generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime()}
}

let generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime()}
}


module.exports = {generateMessage, generateLocationMessage}

// nothing too fancy here. We just generate a message based on the text we recieved from the user.
