const path = require('path');
const express = require('express');

let app = express();

app.use(express.static(path.join(__dirname, '../public')))

app.listen(8000, () => {
  console.log('App running on port 8000')
})
