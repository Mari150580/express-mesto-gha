const express = require('express');
const cardRouter = express.Router();
const {createCard, deleteCard, getCards, likeCard, dislikeCard} = require("../controllers/cards");

cardRouter.get('/cards', getCards); //возвращает все карточки
cardRouter.delete('/cards/:cardId', deleteCard); //удаляет карточку по идентификатору
cardRouter.post('/cards',  createCard); //создаёт карточку

cardRouter.put('/cards/:cardId/likes',  likeCard);
cardRouter.delete('/cards/:cardId/likes',  dislikeCard);

module.exports = cardRouter;