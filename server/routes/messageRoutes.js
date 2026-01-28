import express from 'express';
import {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
  markAsRead,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/', protect, getMessages);
router.get('/:id', protect, getMessageById);
router.delete('/:id', protect, deleteMessage);
router.put('/:id/read', protect, markAsRead);

export default router;
