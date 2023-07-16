import express from 'express';
import { connect } from 'mongoose';
import routes from './routes/index.js';
import { login, createUser } from './controllers/users.js';
import auth from './middlewares/auth.js';

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth, routes);

connect(DB_URL)
  // eslint-disable-next-line no-console
  .then(() => console.log('db ok'))
  // eslint-disable-next-line no-console
  .catch((err) => console.log('db err', err));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`apps running on port ${PORT}`);
});
