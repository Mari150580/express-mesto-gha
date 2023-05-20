const mongoose = require('mongoose');
const express = require('express');
/* const path = require('path'); */
const BodyParser = require('body-parser');
const validationErrors = require('celebrate').errors;
const NotFoundError = require('./errors/NotFoundError');

const usersRouter = require('./routes/users'); // импортируем роутер
const cardsRouter = require('./routes/cards');
const signupRouter = require('./routes/signup');
const signInRouter = require('./routes/signin');
const errorHandler = require('./middlewares/error-handler');
const limiter = require('./middlewares/limiter');

const app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
const { PORT = 3000 } = process.env;
// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(limiter);
// app.use(express.static(path.join(__dirname, "pablic"))); для подключения фронта

// подключаем мидлвары, роуты и всё остальное...

app.use('/signup', signupRouter);

app.use('/signin', signInRouter);

app.use('/users', usersRouter); // Подключаем роутеры

app.use('/cards', cardsRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('URL does not exist'));
});

app.use(validationErrors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
