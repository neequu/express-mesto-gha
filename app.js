import express from "express";
import { connect } from "mongoose";
import routes from "./routes/index.js";

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "64aaa960472ebba347ce38c5",
  };
  next();
});

app.use(routes);
connect(DB_URL)
  .then(() => console.log("db ok"))
  .catch((err) => console.log("db err", err));

app.listen(PORT, () => {
  console.log(`apps running on port ${PORT}`);
});
