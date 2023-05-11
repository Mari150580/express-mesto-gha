const express = require('express');

const cardRouter = express.Router();
const {
  createUser,
  getUser,
  getUsers,
  editUserProfile,
  editUserAvatar,
} = require('../controllers/users');

cardRouter.get('/users', getUsers);
cardRouter.get('/users/:userId', getUser);
cardRouter.post('/users', createUser);

cardRouter.patch('/users/me', editUserProfile);
cardRouter.patch('/users/me/avatar', editUserAvatar);

module.exports = cardRouter;
