require('dotenv').config();

const express = require('express');
const chalk = require('chalk');

const db = require('./models');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./middlewares/apiKey'));

app.use('/auth', require('./routes/auth'));
app.use('/me', require('./routes/me'));

app.use(require('./middlewares/errorHandler'));

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log(
      chalk.green('Database connection has been established succesfully.')
    );

    await db.sequelize.sync();
    // await db.sequelize.sync({ force: true });
    // await db.sequelize.sync({ alter: true });
    console.log(
      chalk.blue('All database models were synchronized successfully.')
    );

    app.listen(port, () => {
      console.log(chalk.green.bold(`Server is listening on port ${port}!`));
    });
  } catch (error) {
    console.log('Unable to connect to the database', error);
  }
})();
