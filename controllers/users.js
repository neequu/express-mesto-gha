import mongoose from "mongoose";
import User from "../models/User.js";

export const getUsers = async (_, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "couldn't get users" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "couldn't get user" });
  }
};

export const postUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;

    const doc = new User({ name, about, avatar });
    const user = await doc.save();

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: "incorrect input" });
    }
    return res.status(500).json({ message: "couldn't create user" });
  }
};

export const patchUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: "incorrect input" });
    }
    return res.status(500).json({ message: "couldn't update user" });
  }
};
export const patchUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.json(user);
  } catch (err) {
    console.log(err);
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: "incorrect input" });
    }
    return res.status(500).json({ message: "couldn't update avatar" });
  }
};
