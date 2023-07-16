import { NOT_FOUND_STATUS } from '../utils/constants.js';

const page404 = (_, res) => res.status(NOT_FOUND_STATUS).json({ message: 'page not found' });

export default page404;
