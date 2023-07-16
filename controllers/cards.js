import mongoose from 'mongoose';
import Card from '../models/card.js';
import {
  BAD_REQUEST_STATUS,
  INTERNAL_SERVER_STATUS,
  OK_STATUS,
  NOT_FOUND_STATUS,
  CREATED_STATUS,
} from '../utils/constants.js';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import ForbiddenError from '../errors/forbidden.js';

export const getCards = async (_, res, next) => {
  try {
    const cards = await Card.find();
    return res.status(OK_STATUS).json(cards);
  } catch (err) {
    return next(err);
  }
};

export const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  try {
    const card = await Card.findByIdAndDelete(cardId).orFail(() => {
      throw new NotFoundError();
    });
    if (card.owner !== ownerId) {
      throw new ForbiddenError();
    }

    return res.status(OK_STATUS).json({ message: 'success' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError());
    }
    return next(err);
  }
};

export const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(CREATED_STATUS).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError());
    }
    return next(err);
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
