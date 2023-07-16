import express from 'express';
import {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users.js';

import { validateGetUser, validateUpdateUserInfo, validateUpdateAvatar } from '../middlewares/validation.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validateGetUser, getUser);
router.patch('/me', validateUpdateUserInfo, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default router;
