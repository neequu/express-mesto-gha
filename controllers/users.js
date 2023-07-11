import mongoose from "mongoose";
import User from "../models/User.js";
import {
  BAD_REQUEST_STATUS,
  INTERNAL_SERVER_STATUS,
  OK_STATUS,
  NOT_FOUND_STATUS,
  CREATED_STATUS,
} from "../utils/constants.js";

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
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).orFail(new Error("not found"));

    return res.status(OK_STATUS).json(user);
  } catch (err) {
    if (err.message === "not found") {
      return res.status(NOT_FOUND_STATUS).send({ message: "user not found" });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(BAD_REQUEST_STATUS)
        .send({ message: "error getting the user" });
    }
    return res.status(INTERNAL_SERVER_STATUS).send({ message: "server error" });
  }
};

export const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.status(CREATED_STATUS).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(BAD_REQUEST_STATUS)
        .json({ message: "incorrect input" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't create user" });
  }
};

export const updateProfile = async (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name, about },
      { new: true, runValidators: true },
    );

    return res.status(OK_STATUS).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(BAD_REQUEST_STATUS)
        .json({ message: "incorrect input" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't update user" });
  }
};

export const updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  try {
    await User.findByIdAndUpdate(
      owner,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.status(OK_STATUS).json({ avatar });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST_STATUS).json({ message: "incorrect input" });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't update avatar" });
  }
};
