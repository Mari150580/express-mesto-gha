const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { URL_REGEXP } = require('../config');

const signupRouter = express.Router();
const { createUser } = require('../controllers/users');

signupRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(URL_REGEXP),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

module.exports = signupRouter;
