import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcrypt';
import { linkRegex } from '../utils/constants.js';
import UnathorizedError from '../errors/unathorized.js';

const UserSchema = new Schema({
  name: {
    type: String,
    default: 'zz',
    minlength: [2, 'длина поля должна быть от 2 до 30 символов'],
    maxlength: [30, 'длина поля должна быть от 2 до 30 символов'],
  },

  about: {
    type: String,
    default: 'zz',
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
UserSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { // не нашёлся — отклоняем промис
        return Promise.reject(new UnathorizedError('bad email or pswrd'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // отклоняем промис
            return Promise.reject(new UnathorizedError('bad email or pswrd'));
          }

          return user;
        });
    });
};
export default model('user', UserSchema);
