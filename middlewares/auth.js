import jwt from 'jsonwebtoken';
import { secretKey } from '../utils/constants.js';
import UnathorizedError from '../errors/unathorized.js';

export default function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnathorizedError('need to sign in'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new UnathorizedError('need to sign in'));
  }

  req.user = payload;

  return next();
}
