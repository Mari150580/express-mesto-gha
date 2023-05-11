const User = require('../models/user');
const { ERROR_BAD_REQUEST, ERROR_SERVER, ERROR_NOT_FOUND } = require('../config');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Error validation user' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Error creating user' });
      }
    });
};

const getUser = (req, res) => {
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
        res.status(ERROR_NOT_FOUND).send({ message: 'Not found' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Error creating user' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(ERROR_SERVER).send({ message: 'Internal server error' });
    });
};

const editUserProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id: userId } = req.user;
  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Error validation user' });
      }
      res.status(ERROR_SERVER).send({ message: 'Internal здесь server error' });
    });
};

const editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Error validation user' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Internal server error' });
      }
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  editUserProfile,
  editUserAvatar,
};
