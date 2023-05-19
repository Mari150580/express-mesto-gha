const express = require('express');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { URL_REGEXP } = require('../config');

const cardRouter = express.Router();
const {
  getUser,
  getUsers,
  editUserProfile,
  editUserAvatar,
  getInformationUsers,
} = require('../controllers/users');

cardRouter.get('/', auth, getUsers);

cardRouter.get('/me', auth, getInformationUsers);

cardRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);

cardRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUserProfile);
cardRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(URL_REGEXP),
  }),
}), editUserAvatar);

module.exports = cardRouter;
