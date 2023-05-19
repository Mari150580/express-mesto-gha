const Card = require('../models/card');
const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND } = require('../config');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(401).send({ message: 'Error validation card' });
      } else {
        next(err);
      }
    });
};

const deleteCard = async (req, res, next) => {
  try {
    const findedCard = await Card.findById(req.params.cardId).orFail();
    const deletedCard = await Card.deleteOne({
      _id: findedCard._id,
      owner: req.user._id,
    });
    if (deletedCard.deletedCount === 0) {
      res.status(ERROR_NOT_FOUND).send({ message: 'Ошибка доступа! Карточка с данным не принадлежит пользователю' });
    } else {
      return res
        .status(200)
        .send({ message: 'Карточка удалена успешно и без ошибок' });
    }
  } catch (err) {
    return next(err);
  }
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
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
        res.status(ERROR_BAD_REQUEST).send({ message: 'Not found' });
      } else if (err.name === 'Error') { // проверка _id не существует в базе
        res.status(ERROR_NOT_FOUND).send({ message: 'Not found' });
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
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
        res.status(ERROR_BAD_REQUEST).send({ message: 'Not found' });
      } else if (err.name === 'Error') { // проверка _id не существует в базе
        res.status(ERROR_NOT_FOUND).send({ message: 'Not found' });
      } else {
        next(err);
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
