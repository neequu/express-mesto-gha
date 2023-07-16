import express from 'express';
import {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
