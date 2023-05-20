const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    // имя карточки
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    // ссылка на картинку
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Вы ввели неправильный формат ссылки (невалидно)',
    },
  },
  owner: {
    // ссылка на модель автора карточки
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле `owner` является обязательным для заполнения'],
  },
  createdAt: {
    // дата создания
    type: Date,
    default: Date.now,
  },
  likes: {
    // список лайкнувших пост пользователей,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
});

module.exports = mongoose.model('card', cardSchema);
