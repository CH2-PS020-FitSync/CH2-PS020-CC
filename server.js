require('dotenv').config();

const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', require('./routes/auth'));
app.use('/me', require('./routes/me'));

app.listen(port, () => {
  console.log(`The server is listening on port ${port}!`);
});
