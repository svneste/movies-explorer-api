require('dotenv').config();
const express = require('express');

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');
const routerNotFound = require('./errors/error-not-found');
const errorHandler = require('./middlewares/errorHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  createUser,
  login,
} = require('./controllers/users');
const {
  validationCreateUser,
  validationLoginUser,
} = require('./middlewares/validations');
const auth = require('./middlewares/auth');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(requestLogger);

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLoginUser, login);

app.use(auth);

app.use('/users', routerUsers);
app.use('/movies', routerMovies);
app.use('*', routerNotFound);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
}).then(() => console.log('yes'))
  .catch((e) => console.log(e));

app.listen(PORT, () => {
});
