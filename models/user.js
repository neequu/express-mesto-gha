import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcrypt';
import { linkRegex } from '../utils/constants.js';
import UnathorizedError from '../errors/unathorized.js';

const UserSchema = new Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'length of this field should be 2-30 symbols'],
    maxlength: [30, 'length of this field should be 2-30 symbols'],
  },

  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'length of this field should be 2-30 symbols'],
    maxlength: [30, 'length of this field should be 2-30 symbols'],
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => linkRegex.test(url),
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'incorrect email',
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

// eslint-disable-next-line func-names
UserSchema.statics.findUserByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) return Promise.reject(new UnathorizedError('bad email or pswrd'));
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return Promise.reject(new UnathorizedError('bad email or pswrd'));
    return user;
  } catch (err) {
    return err;
  }
};
export default model('user', UserSchema);
