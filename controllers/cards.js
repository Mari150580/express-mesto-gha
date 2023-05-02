const Card = require("../models/card");
const {ERROR_CODE, ERROR_SERVER} = require("../config")



const createCard = (req, res) => {
  const {name, link} = req.body;
  return Card.create({name, link, owner: req.user._id})
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
  return Card.findByIdAndDelete(req.params.cardId)
  .orFail(() =>{
    throw new Error("Card with this id does not exist");
   })
  .then((card) => res.status(200).send(card))
  .catch((err) =>{
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
  return Card.findByIdAndUpdate(req.params.cardId,
    {$addToSet: { likes: req.user._id }},
    { new: true, runValidators: true })

  .then(() => {

    res.status(201).send({likes: req.user._id});

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
  return Card.findByIdAndRemove(cardId, {$pull: { likes: req.user._id }}, { new: true })
  .then((card) => {res.status(201).send({data: card});
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