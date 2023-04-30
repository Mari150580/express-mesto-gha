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
   //выкидывает ошибку если пользователь не найден
   /*.orFail(() =>{
    throw new Error("User not found");
   })*/
  .then((user) => {
    if(!user) {
      res.status(400).send({message:`"Not ghg found" ${err}`});
    }
    res.status(200).send({data:user})
  })
  .catch((err) =>{
    if(err.message === "Not ghg found") {
    res.status(404).send({message:`"Not found" ${err}`});
    } else {
      res.status(ERROR_SERVER).send({message:`Error creating user ${err}`})
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

const editUserProfile =(req, res) =>{
  const {name, about} = req.body;
  const { _id: userId} = req.user;
  return User.findByIdAndUpdate(userId, {name, about}, { new: true, runValidators: true } )
  .then((user) => res.status(200).send({data: user}))
  .catch((err) =>{
    res.status(ERROR_SERVER).send({message:`Internal server error ${err}`})
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