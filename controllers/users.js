const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const validationErrors = require('celebrate').errors;

const User = require('../models/user');
const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, USER_EXISTS, INCORRECT_DATA } = require('../config');

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then ((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Error validation user' });
      } else if (err.code === 11000) { // проверка на индивидуальность email
        res.status(USER_EXISTS).send({ message: 'Пользователь с такими данными уже существует' });
      } else if (err.name === 'Error') {
        res.status(400).send({ message: 'Error validation00' });
      } else if (err.name === 'validationErrors') {
        res.status(400).send({ message: 'Error validation user11' });
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    . then((user) => {
      if (!user) {
        throw new Error('User not found');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      // проверка _id не валидный
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Not found' });
      } else if (err.name === 'Error') { // проверка _id не существует в базе
        res.status(ERROR_NOT_FOUND).send({ message: 'Not found000' });
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      next(err);
    });
};


const editUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  // const { _id: userId } = req.params.user;
  return User.findByIdAndUpdate(
    req.params.userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Error validation user' });
      }
      next(err);
    });
};

const editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.params.userId, avatar, { new: true, runValidators: true })
    .then(() => res.status(200).send({ avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Error validation user' });
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  // data.token, сроком на неделю, сверка паролей
  User
    .findOne({ email }).select('+password')
    .orFail(() => res.status(INCORRECT_DATA).send({ message: 'Пользователь не найден' }))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (matched) {
          return user;
        }
        res.status(INCORRECT_DATA).send({ message: 'Пользователь не найден' });
      }))
    .then((user) => {
      const token = jsonwebtoken.sign( {_id: user._id }, 'secret', { expiresIn: '7d' });
      res.status(200).send({ user, token });
    })
    .catch((err) => {
      next(err);
    });
};

const getInformationUsers = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(req.headers);
  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(token, 'secret');
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  console.log(payload);
  User
    .findById(payload._id)
    .orFail(() => res.status(404).send({ message: 'Пользователь не найден' }))
    .then((user) => res.send(user))
    .catch((err) =>
  console.log(err)
    )
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  editUserProfile,
  editUserAvatar,
  login,
  getInformationUsers,
};
