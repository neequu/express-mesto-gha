import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcrypt';
import { linkRegex } from '../utils/constants.js';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'длина поля должна быть от 2 до 30 символов'],
    maxlength: [30, 'длина поля должна быть от 2 до 30 символов'],
  },

  about: {
    type: String,
    required: true,
    minlength: [2, 'длина поля должна быть от 2 до 30 символов'],
    maxlength: [30, 'длина поля должна быть от 2 до 30 символов'],
  },

  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (url) => linkRegex.test(url),
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
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

    if (!user) {
      throw new Error('Неправильные почта или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new Error('Неправильные почта или пароль');
    }

    return user;
  } catch (err) {
    return err;
  }
};
export default model('user', UserSchema);
