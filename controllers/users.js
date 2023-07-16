import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {
  OK_STATUS, CREATED_STATUS, saltRounds, secretKey,
} from '../utils/constants.js';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import ConflictError from '../errors/confilct.js';

export const getUsers = async (_, res, next) => {
  try {
    const users = await User.find();
    return res.status(OK_STATUS).json(users);
  } catch (err) {
    return next(err);
  }
};

export const getUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).orFail(new Error('not found'));

    return res.status(OK_STATUS).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('bad user data'));
    }
    return next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { _id } = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id }, secretKey, { expiresIn: '7d' });
    return res.status(OK_STATUS).json({ token });
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (req, res, next) => {
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
    if (err.code === 11000) return next(new ConflictError('already exists'));

    if (err instanceof mongoose.Error.ValidationError) return next(new BadRequestError('bad data'));

    return next(err);
  }
};

const updateUser = async (req, res, next, data) => {
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(owner, data, {
      new: true,
      runValidators: true,
    }).orFail(() => {
      throw new NotFoundError('user not found');
    });

    return res.status(OK_STATUS).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) return next(new BadRequestError('bad data'));
    return next(err);
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

export const getCurrentUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).orFail(new NotFoundError('user not found'));

    return res.status(OK_STATUS).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) return next(new BadRequestError('bad data'));
    return next(err);
  }
};
