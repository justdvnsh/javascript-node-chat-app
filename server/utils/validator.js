let isRealStr = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
}

// we check if the string i.e. name and room name passed are real strings are not.
// Also we check that someone is not passing an empty string.
// because , '      ' string like this has a length, but we check that by trimming of the whitespace before and after.

module.exports = {isRealStr}
