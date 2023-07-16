import { UNATHORIZED_STATUS } from '../utils/constants.js';

export default class UnathorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNATHORIZED_STATUS;
  }
}
