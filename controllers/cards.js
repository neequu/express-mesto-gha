import mongoose from "mongoose";
import Card from "../models/Card.js";

export const getCards = async (_, res) => {
  try {
    const cards = await Card.find();
    return res.status(200).json(cards);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "couldn't get cards" });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "card not found" });
    }

    return res.status(200).json(card);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "couldn't delete card" });
  }
};

export const postCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;

    const doc = new Card({ name, link, owner: ownerId });
    const card = await doc.save();

    return res.status(201).json(card);
  } catch (err) {
    console.log(err);
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: "incorrect input" });
    }
    return res.status(500).json({ message: "couldn't create card" });
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
      return res.status(404).json({ message: "card not found" });
    }
    return res.status(200).json(card);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "something went wrong during like attempt" });
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
      return res.status(404).json({ message: "card not found" });
    }
    return res.status(200).json(card);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "something went wrong during like attempt" });
  }
};
