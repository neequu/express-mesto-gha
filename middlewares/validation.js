import { celebrate, Joi } from 'celebrate';
import { objIdRegex, linkRegex } from '../utils/constants.js';
// auth
export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(objIdRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
// user
export const validateGetUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().regex(objIdRegex),
  }),
});

export const validateUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

export const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(linkRegex),
  }),
});
// cards
export const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(linkRegex),
  }),
});

export const validateUpdateCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(objIdRegex),
  }),
});
