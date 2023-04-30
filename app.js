const mongoose = require("mongoose");
const express = require("express");
//const path = require("path");
const usersRouter = require("./routes/users"); // импортируем роутер
const cardsRouter = require("./routes/cards");

const app = express();

const { PORT = 3000} = process.env;
// подключаемся к серверу mongo
mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(express.json());

//app.use(express.static(path.join(__dirname, "pablic"))); для подключения фронта

//временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '644bdd3f8049019a4238b417' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

/*app.use('*', (req, res) => {
  res.status(404).send({message:`Error creating user ${err}`});
});*/

// подключаем мидлвары, роуты и всё остальное...
app.use('/', usersRouter); // Подключаем роутеры
app.use('/', cardsRouter);

app.listen(PORT, () =>{
  console.log(`App listening on port ${PORT}`)
});