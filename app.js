const mongoose = require('mongoose');
const express = require('express');
const { celebrate, Joi } = require('celebrate');
/* const path = require('path'); */
const BodyParser = require('body-parser');
const validationErrors = require('celebrate').errors;

const usersRouter = require('./routes/users'); // импортируем роутер
const cardsRouter = require('./routes/cards');
const { ERROR_NOT_FOUND } = require('./config');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/error-handler');

const app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
const { PORT = 3000 } = process.env;
// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
// app.use(express.static(path.join(__dirname, "pablic"))); для подключения фронта

// подключаем мидлвары, роуты и всё остальное...
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), usersRouter); // Подключаем роутеры
app.use('/', cardsRouter);

app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'URL does not exist' });
});

app.use(validationErrors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
