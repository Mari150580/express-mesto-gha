const express = require('express');
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const { URL_REGEXP } = require('../config');

const cardRouter = express.Router();
const {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.use(auth); // защита роутов

cardRouter.get('/', getCards); // возвращает все карточки
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCard); // удаляет карточку по идентификатору

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(URL_REGEXP),
  }),
}), createCard); // создаёт карточку

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = cardRouter;
/*  "name": "hghhhggbxbfgghgf",
        "link": "fgfggcbxxfhgfgghgfhgfh",
        "owner": "6465e22d54c76bfb8d8a1954",
        "likes": [],
        "_id": "6465e742b0c2e0d77f6d25e8",
        "createdAt": "2023-05-18T08:52:18.247Z", */