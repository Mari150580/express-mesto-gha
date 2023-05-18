const express = require('express');
const auth = require('../middlewares/auth');

const cardRouter = express.Router();
const {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.use(auth); // защита роутов

cardRouter.get('/cards', getCards); // возвращает все карточки
cardRouter.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору
cardRouter.post('/cards', createCard); // создаёт карточку

cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardRouter;
/*  "name": "hghhhggbxbfgghgf",
        "link": "fgfggcbxxfhgfgghgfhgfh",
        "owner": "6465e22d54c76bfb8d8a1954",
        "likes": [],
        "_id": "6465e742b0c2e0d77f6d25e8",
        "createdAt": "2023-05-18T08:52:18.247Z", */