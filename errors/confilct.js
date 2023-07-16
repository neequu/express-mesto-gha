import { CONFLICT_STATUS } from '../utils/constants.js';

export default class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_STATUS;
  }
}
