import { FORBIDDEN_STATUS } from '../utils/constants.js';

export default class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_STATUS;
  }
}
