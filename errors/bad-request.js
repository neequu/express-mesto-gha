import { BAD_REQUEST_STATUS } from '../utils/constants.js';

export default class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_STATUS;
  }
}
