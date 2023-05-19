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

cardRouter.get('/', auth, getUsers);
cardRouter.get('/:userId', getUser);
cardRouter.get('/me', getInformationUsers);

cardRouter.patch('/me', editUserProfile);
cardRouter.patch('/me/avatar', editUserAvatar);

// cardRouter.use(auth); // защита роутов

module.exports = cardRouter;

/* "name": "Жак1",
        "about": "Исследователь",
        "avatar": "http://kadet39.ru/wp-",
        "email": "hgfgfth@djjjhjghghfjgjr.ru",
        "password": "fhgfhgfghghghhdghdgd" */
