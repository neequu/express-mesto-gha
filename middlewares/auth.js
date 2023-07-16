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
      .json({ message: 'need to sign in' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return res
      .status(UNATHORIZED_STATUS)
      .json({ message: 'need to sign in' });
  }

  req.user = payload;

  next();
}
