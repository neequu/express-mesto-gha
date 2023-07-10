import mongoose from "mongoose";
import User from "../models/User.js";
import {
  OK_STATUS,
  CREATED_STATUS,
  NOT_FOUND_STATUS,
  BAD_REQUEST_STATUS,
  INTERNAL_SERVER_STATUS,
} from "../constants.js";

export const getUsers = async (_, res) => {
  try {
    const users = await User.find();
    return res.status(OK_STATUS).json(users);
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't get users" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(BAD_REQUEST_STATUS).json({ message: "user not found" });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND_STATUS).json({ message: "user not found" });
    }

    return res.status(OK_STATUS).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_STATUS).json({ message: "bad input" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't get user" });
  }
};

export const postUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;

    const doc = new User({ name, about, avatar });
    const user = await doc.save();

    return res.status(CREATED_STATUS).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST_STATUS).json({ message: "incorrect input" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't create user" });
  }
};

export const patchUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const owner = req.user._id;

    if (
      !(name.length >= 2 && name.length <= 30) ||
      !(about.length >= 2 && about.length <= 30)
    ) {
      return res
        .status(BAD_REQUEST_STATUS)
        .json({ message: "incorrect input" });
    }

    // const userId = req.params.id;

    // if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    //   return res.status(BAD_REQUEST_STATUS).json({ message: "user not found" });
    // }

    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true }
    );
    if (!user) {
      return res.status(NOT_FOUND_STATUS).json({ message: "user not found" });
    }

    return res.status(OK_STATUS).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST_STATUS).json({ message: "incorrect input" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't update user" });
  }
};
export const patchUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    // const userId = req.params.id;

    // if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    //   return res.status(BAD_REQUEST_STATUS).json({ message: "user not found" });
    // }
    const owner = req.user._id;

    const user = await User.findByIdAndUpdate(owner, { avatar }, { new: true });
    if (!user) {
      return res.status(NOT_FOUND_STATUS).json({ message: "user not found" });
    }
    return res.json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST_STATUS).json({ message: "incorrect input" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't update avatar" });
  }
};
