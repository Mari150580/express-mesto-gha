const User = require("../models/user");
const {ERROR_CODE, ERROR_SERVER} = require("../config")

const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  return User.create({name, about, avatar})
  .then((user) => res.status(201).send({data: user}))
  .catch((err) => {
  if(err.name === "ValidationError") {
    res.status(ERROR_CODE).send({message:`Error validation user ${err}`})
  } else {
  res.status(ERROR_SERVER).send({message:`Error creating user ${err}`})
  }
});
};

const getUser =(req, res) =>{
  return User.findById(req.params.userId)
  .then((user) => {
    if(!user) {
      throw new Error("User not found");
    }
    res.status(200).send({data:user})
  })
  .catch((err) =>{
    // проверка _id не валидный
    if(err.name === "CastError") {
    res.status(400).send({message:`"Not found" ${err}`});
    }
    // проверка _id не существует в базе
    if ( err.name === "Error") {
      res.status(404).send({message:`"Not found" ${err}`});
    }
    else {
      res.status(500).send({message:`Error creating user ${err}`})
    }
  });
};

const getUsers =(req, res) =>{
  return User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) =>{
    res.status(ERROR_SERVER).send({message:`Internal server error ${err}`})
  });
};

const editUserProfile =(req, res)  => {
  const {name, about} = req.body;
  const { _id: userId} = req.user;
  return User.findByIdAndUpdate(userId, {name, about}, { new: true, runValidators: true } )
  .then((user) => res.status(200).send({data: user}))
  .catch((err) =>{
    if(err.name === "ValidationError") {
      res.status(ERROR_CODE).send({message:`Error validation user ${err}`})
    }
    res.status(ERROR_SERVER).send({message:`Internal здесь server error ${err}`})
  });
};



const editUserAvatar =(req, res) =>{
  const {avatar} = req.body;
  const { _id: userId} = req.user;
  return User.findByIdAndUpdate(userId, {avatar}, { new: true, runValidators: true } )
  .then((user) => res.status(200).send({data: user}))
  .catch((err) =>{
    res.status(ERROR_SERVER).send({message:`Internal server error ${err}`})
  });
};

module.exports ={createUser, getUser, getUsers, editUserProfile, editUserAvatar};