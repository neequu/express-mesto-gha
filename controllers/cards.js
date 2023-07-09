import mongoose from "mongoose";
import Card from "../models/Card.js";
import {
  OK_STATUS,
  CREATED_STATUS,
  NOT_FOUND_STATUS,
  BAD_REQUEST_STATUS,
  INTERNAL_SERVER_STATUS,
} from "../constants.js";

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
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(NOT_FOUND_STATUS).json({ message: "card not found" });
    }

    return res.status(OK_STATUS).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_STATUS).json({ message: "card not found" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't delete card" });
  }
};

export const postCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;

    const doc = new Card({ name, link, owner: ownerId });
    const card = await doc.save();

    return res.status(CREATED_STATUS).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST_STATUS).json({ message: "incorrect input" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't create card" });
  }
};

export const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!card) {
      return res.status(NOT_FOUND_STATUS).json({ message: "card not found" });
    }
    return res.status(OK_STATUS).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_STATUS).json({ message: "card not found" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't like the card" });
  }
};
export const unlikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!card) {
      return res.status(NOT_FOUND_STATUS).json({ message: "card not found" });
    }
    return res.status(OK_STATUS).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_STATUS).json({ message: "card not found" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't unlike the card" });
  }
};
