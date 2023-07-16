import express from 'express';
import { connect } from 'mongoose';
import routes from './routes/index.js';
import { login, createUser } from './controllers/users.js';
import auth from './middlewares/auth.js';
import { INTERNAL_SERVER_STATUS } from './utils/constants.js';

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth, routes);

app.use((err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_STATUS, message } = err;
  const errorMessage = statusCode === INTERNAL_SERVER_STATUS
    ? 'server error'
    : message;

  res
    .status(statusCode)
    .json({
      message: errorMessage,
    });

  next();
});

connect(DB_URL)
  // eslint-disable-next-line no-console
  .then(() => console.log('db ok'))
  // eslint-disable-next-line no-console
  .catch((err) => console.log('db err', err));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`apps running on port ${PORT}`);
});
