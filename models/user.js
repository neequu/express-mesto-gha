import { Schema, model } from 'mongoose';
// eslint-disable-next-line import/no-unresolved
import isEmail from 'validator/lib/isEmail';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';

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
      validator: (url) => /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url),
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Неверно указана почта',
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
    minlength: [5, 'длина поля должна быть от 5 до 30 символов'],
    maxlength: [30, 'длина поля должна быть от 5 до 30 символов'],
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
