const Card = require('../models/card');
const { ERROR_CODE, ERROR_SERVER, ERROR_NOTFOUND } = require('../config');

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Error validation card' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Error creating card' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        throw new Error('Card not found');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      // проверка _id не валидный
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Not found' });
      } else if (err.name === 'Error') { // проверка _id не существует в базе
        res.status(ERROR_NOTFOUND).send({ message: 'Not found' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Internal server error' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(ERROR_SERVER).send({ message: 'Internal server error' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('Card not found');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      // проверка _id не валидный
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Not found' });
      } else if (err.name === 'Error') { // проверка _id не существует в базе
        res.status(ERROR_NOTFOUND).send({ message: 'Not found' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Internal server error' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('Card not found');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      // проверка _id не валидный
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Not found' });
      } else if (err.name === 'Error') { // проверка _id не существует в базе
        res.status(ERROR_NOTFOUND).send({ message: 'Not found' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Internal server error' });
      }
    });
};

module.exports = {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
};
