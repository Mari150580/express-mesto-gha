const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UserExistsError = require('../errors/UserExistsError');
const IncorrectDataError = require('../errors/IncorrectDataError');

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const dataUser = user.toObject();
      delete dataUser.password;
      return res.status(201).send(dataUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Error validation user'));
      } else if (err.code === 11000) { // проверка на индивидуальность email
        next(new UserExistsError('Пользователь с такими данными уже существует'));
      } else if (err.name === 'Error') {
        next(new BadRequestError('Error validation'));
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
        next(new BadRequestError('Not found'));
      } else if (err.name === 'Error') { // проверка _id не существует в базе
        next(new NotFoundError('Not found'));
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
    .then(() => res.status(200).send({ name, about }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Error validation user'));
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
        next(new BadRequestError('Error validation user'));
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
    .orFail(() => next(new IncorrectDataError('Пользователь не найден')))
    .then((user) => bcrypt.compare(password, user.password)
    // eslint-disable-next-line consistent-return
      .then((matched) => {
        if (matched) {
          return user;
        }
        next(new IncorrectDataError('Пользователь не найден'));
      }))
    .then((user) => {
      const token = jsonwebtoken.sign(
        { _id: user._id },
        'secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ user, token });
    })
    .catch((err) => {
      next(err);
    });
};

const getInformationUsers = (req, res, next) => {
  const userId = req.user._id;
  User
    .findById(userId)
    .orFail(() => next(new NotFoundError('Not found')))
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      next(err);
    });
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
