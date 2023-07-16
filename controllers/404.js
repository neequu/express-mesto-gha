import NotFoundError from '../errors/not-found.js';

const page404 = (req, res, next) => next(new NotFoundError('page not found'));

export default page404;
