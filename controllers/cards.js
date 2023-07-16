import mongoose from 'mongoose';
import Card from '../models/card.js';
import { OK_STATUS, CREATED_STATUS } from '../utils/constants.js';
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
      throw new NotFoundError('card not found');
    });
    if (card.owner !== ownerId) {
      throw new ForbiddenError('forbidden');
    }

    return res.status(OK_STATUS).json({ message: 'success' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('bad data'));
    }
    return next(err);
  }
};

export const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(CREATED_STATUS).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

const updateCardLike = async (req, res, next, action) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(cardId, action, { new: true }).orFail(() => {
      throw new NotFoundError('card not found');
    });

    return res.status(OK_STATUS).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('incorrect data'));
    }
    return next(err);
  }
};

export const likeCard = (req, res, next) => {
  const owner = req.user._id;
  const likeAction = { $addToSet: { likes: owner } };
  updateCardLike(req, res, next, likeAction);
};

export const unlikeCard = (req, res, next) => {
  const owner = req.user._id;
  const unlikeAction = { $pull: { likes: owner } };
  updateCardLike(req, res, next, unlikeAction);
};
