const Card = require("../models/card");
const {ERROR_CODE, ERROR_SERVER} = require("../config")



const createCard = (req, res) => {
  const {name, link} = req.body;
  return Card.create({name, link, likes, owner: req.user._id})
  .then((card) => res.status(201).send({data: card}))
  .catch((err) => {
  if(err.name === "ValidationError") {
    res.status(ERROR_CODE).send({message:`Error validation card ${err}`})
  } else {
  res.status(ERROR_SERVER).send({message:`Error creating card ${err}`})
  }
});
};

const deleteCard =(req, res) =>{
  const {cardId} = req.params;
  return Card.findByIdAndDelete(cardId)
  .then((card) => {
    if(!card) {
      throw new Error("User not found");
    }
    res.status(200).send(card)
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
    res.status(ERROR_SERVER).send({message:`Internal server error ${err}`})
  });
};


const getCards =(req, res) =>{
  return Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((err) =>{
    res.status(ERROR_SERVER).send({message:`Internal server error ${err}`})
  });
};

const likeCard =(req, res) => {
  const {cardId} = req.params;
  return Card.findByIdAndUpdate(cardId,
    {$addToSet: { likes: req.user._id }},
    { new: true, runValidators: true })

  .then((card) => {
    if(!card) {
      throw new Error("User not found");
    }
    res.status(201).send({data: card});

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
    res.status(ERROR_SERVER).send({message:`Internal server error ${err}`})
    console.log(err)
  });
};

const dislikeCard = (req, res) => {
  const {cardId} = req.params;
  return Card.findByIdAndRemove(cardId, {$pull: { likes: req.user._id }}, { new: true, runValidators: true })
  .then((card) => {
    if(!card) {
      throw new Error("User not found");
    }
    res.status(200).send({data: card});
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
    res.status(ERROR_SERVER).send({message:`Internal server error ${err}`})
  });
};


module.exports ={createCard, deleteCard, getCards, likeCard, dislikeCard };