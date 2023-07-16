// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import {
  secretKey, UNATHORIZED_STATUS,
} from '../utils/constants.js';

// eslint-disable-next-line consistent-return
export default function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(UNATHORIZED_STATUS)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return res
      .status(UNATHORIZED_STATUS)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
}
