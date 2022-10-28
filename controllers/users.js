const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequetError = require('../errors/bad-request-err');
const EmailExist = require('../errors/email-err');
// const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => {
      res.send({
        data: {
          name, email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequetError('Переданы некорректные данные при создании пользователя'));
      else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new EmailExist('Данный email уже существует'));
      } else {
        next(err);
      }
    });
};

const findUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const refreshUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Такой пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequetError('Неверные данные');
      }
      if (err.code === 11000) {
        throw new EmailExist('Данный email уже существует');
      }
      next(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key'}`, { expiresIn: '7d' });
      // const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  findUser,
  refreshUserInfo,
  login,
};
