const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const route = require('./route');


app.use(route);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})