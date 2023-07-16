import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {
  BAD_REQUEST_STATUS,
  INTERNAL_SERVER_STATUS,
  OK_STATUS,
  NOT_FOUND_STATUS,
  CREATED_STATUS,
  UNATHORIZED_STATUS,
  saltRounds,
  secretKey,
} from '../utils/constants.js';

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
    const user = await User.findById(userId).orFail(new Error('not found'));

    return res.status(OK_STATUS).json(user);
  } catch (err) {
    if (err.message === 'not found') {
      return res.status(NOT_FOUND_STATUS).send({ message: 'user not found' });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(BAD_REQUEST_STATUS)
        .send({ message: 'error getting the user' });
    }
    return res.status(INTERNAL_SERVER_STATUS).send({ message: 'server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { _id } = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id }, secretKey, { expiresIn: '7d' });
    return res.status(OK_STATUS).json({ token });
  } catch (err) {
    return res.status(UNATHORIZED_STATUS);
  }
};

export const createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });

    return res.status(CREATED_STATUS).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(BAD_REQUEST_STATUS).json({ message: 'already created' });
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(BAD_REQUEST_STATUS)
        .json({ message: 'incorrect input' });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't create user" });
  }
};

const updateUser = async (req, res, _, data) => {
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(owner, data, {
      new: true,
      runValidators: true,
    });

    return res.status(OK_STATUS).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(BAD_REQUEST_STATUS)
        .json({ message: 'incorrect input' });
    }
    return res
      .status(INTERNAL_SERVER_STATUS)
      .json({ message: "couldn't update user" });
  }
};

export const updateProfile = (req, res, _) => {
  const { name, about } = req.body;
  return updateUser(req, res, _, { name, about });
};
export const updateAvatar = (req, res, _) => {
  const { avatar } = req.body;
  return updateUser(req, res, _, { avatar });
};

export const getCurrentUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).orFail(new Error('not found'));

    return res.status(OK_STATUS).json(user);
  } catch (err) {
    if (err.message === 'not found') {
      return res.status(NOT_FOUND_STATUS).send({ message: 'user not found' });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(BAD_REQUEST_STATUS)
        .send({ message: 'error getting the user' });
    }
    return res.status(INTERNAL_SERVER_STATUS).send({ message: 'server error' });
  }
};
