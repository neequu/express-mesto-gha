import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcrypt';
import { linkRegex } from '../utils/constants.js';

const UserSchema = new Schema({
  name: {
    type: String,
    default: ' ',
    required: true,
    minlength: [2, 'длина поля должна быть от 2 до 30 символов'],
    maxlength: [30, 'длина поля должна быть от 2 до 30 символов'],
  },

  about: {
    type: String,
    default: ' ',
    minlength: [2, 'длина поля должна быть от 2 до 30 символов'],
    maxlength: [30, 'длина поля должна быть от 2 до 30 символов'],
  },

  avatar: {
    type: String,
    default: 'https://cdn.vox-cdn.com/thumbor/ZP9Hg4NQdvje9TlrZhFeZo5x7Vw=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/11656311/LainAt20_Getty_PioneerLDC_Ringer.jpg',
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
