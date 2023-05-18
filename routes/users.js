const express = require('express');
const auth = require('../middlewares/auth');

const cardRouter = express.Router();
const {
  getUser,
  getUsers,
  editUserProfile,
  editUserAvatar,
  getInformationUsers,
} = require('../controllers/users');

cardRouter.get('/users', auth, getUsers);
cardRouter.get('/users/:userId', getUser);
cardRouter.get('/users/me', getInformationUsers);

cardRouter.patch('/users/me', editUserProfile);
cardRouter.patch('/users/me/avatar', editUserAvatar);

// cardRouter.use(auth); // защита роутов

module.exports = cardRouter;
