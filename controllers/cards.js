import mongoose from 'mongoose';
import Card from '../models/card.js';
import {
  BAD_REQUEST_STATUS,
  INTERNAL_SERVER_STATUS,
  OK_STATUS,
  NOT_FOUND_STATUS,
  CREATED_STATUS,
  UNATHORIZED_STATUS,
} from '../utils/constants.js';

export const getCards = async (_, res) => {
  try {
    const cards = await Card.find();
    return res.status(OK_STATUS).json(cards);
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't get cards" });
  }
};

export const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  try {
    const card = await Card.findByIdAndDelete(cardId).orFail(new Error('not found'));
    if (card.owner !== ownerId) {
      return res.status(UNATHORIZED_STATUS).send({ message: 'unathorized request' });
    }

    return res.status(OK_STATUS).json({ message: 'success' });
  } catch (err) {
    if (err.message === 'not found') {
      return res.status(NOT_FOUND_STATUS).send({ message: 'card not found' });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(BAD_REQUEST_STATUS)
        .send({ message: 'error getting the card' });
    }
    return res.status(INTERNAL_SERVER_STATUS).send({ message: 'server error' });
  }
};

export const createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(CREATED_STATUS).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(BAD_REQUEST_STATUS)
        .json({ message: 'incorrect input' });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't create card" });
  }
};

const updateCardLike = async (req, res, _, action) => {
  const { cardId } = req.params;
  try {
    await Card.findByIdAndUpdate(cardId, action, { new: true }).orFail(
      new Error('not found'),
    );

    return res.status(OK_STATUS).json({ message: 'success' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_STATUS).json({ message: 'bad card data' });
    }
    if (err.message === 'not found') {
      return res.status(NOT_FOUND_STATUS).json({ message: 'card not found' });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't set like" });
  }
};

export const likeCard = (req, res, _) => {
  const owner = req.user._id;
  const likeAction = { $addToSet: { likes: owner } };
  updateCardLike(req, res, _, likeAction);
};

export const unlikeCard = (req, res, _) => {
  const owner = req.user._id;
  const unlikeAction = { $pull: { likes: owner } };
  updateCardLike(req, res, _, unlikeAction);
};
