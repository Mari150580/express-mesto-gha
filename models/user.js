const mongoose = require('mongoose');
const validator = require('validator');
const isURL = require('validator/lib/isURL');
// const URL_REGEXP = /http[s]?:\/\/(www\.)?[\w\d\-\._~:\/?#\[\]@!\$&'()*+,;=]+#?/im;

const userSchema = new mongoose.Schema({
  // имя пользователя
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  // информация о пользователе
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  // ссылка на аватарку
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL.test(v),
      message: 'Вы ввели неправильный формат ссылки (невалидно)',
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    unique: true,
    required: true,
    type: String,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Поле email не валидно',
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
});

const User = mongoose.model('user', userSchema);
module.exports = User;
