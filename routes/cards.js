import express from "express";
import {
  getCards,
  deleteCard,
  postCard,
  likeCard,
  unlikeCard,
} from "../controllers/cards.js";

const cardsRouter = express.Router();

cardsRouter.get("/", getCards);
cardsRouter.post("/", postCard);
cardsRouter.delete("/:cardId", deleteCard);
cardsRouter.put("/:cardId/likes", likeCard);
cardsRouter.delete("/:cardId/likes", unlikeCard);

export default cardsRouter;
