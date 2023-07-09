import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";

import usersRouter from "./routes/users.js";
import cardsRouter from "./routes/cards.js";

import { PORT } from "./constants.js";

const url = "mongodb://localhost:27017/mestodb";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(url)
  .then(() => console.log("db ok"))
  .catch((err) => console.log("db error", err));

app.use((req, res, next) => {
  req.user = { _id: "64aaa960472ebba347ce38c5" };
  next();
});

app.use("/cards", cardsRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => console.log("Ссылка на сервер"));
