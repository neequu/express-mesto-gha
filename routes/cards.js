import express from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} from '../controllers/cards.js';
import { validateCreateCard, validateUpdateCard } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateUpdateCard, deleteCard);
router.put('/:cardId/likes', validateUpdateCard, likeCard);
router.delete('/:cardId/likes', validateUpdateCard, unlikeCard);

export default router;
