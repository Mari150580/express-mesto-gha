const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  //имя пользователя
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  //информация о пользователе
  about: {
    //required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  //ссылка на аватарку
  avatar: {
    //required: true,
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;