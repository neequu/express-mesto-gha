import express from "express";
import {
  getUsers,
  getUser,
  postUser,
  patchUser,
  patchUserAvatar,
} from "../controllers/users.js";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUser);
usersRouter.post("/", postUser);
usersRouter.patch("/me", patchUser);
usersRouter.patch("/me/avatar", patchUserAvatar);

export default usersRouter;
