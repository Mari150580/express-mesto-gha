const express = require('express');
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');
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
/* cardRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser); */

cardRouter.get('/me', getInformationUsers);

/* cardRouter.patch('/me', celebrate({
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
*/
// cardRouter.use(auth); // защита роутов

module.exports = cardRouter;

/* "name": "Жак1",
        "about": "Исследователь",
        "avatar": "http://kadet39.ru/wp-",
        "email": "hgfgfth@djjjhjghghfjgjr.ru",
        "password": "fhgfhgfghghghhdghdgd" */
