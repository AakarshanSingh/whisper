import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getUsers, getConversations } from '../controllers/userController.js';

const router = express.Router();

router.get('/', protectRoute, getUsers);
router.get('/conversations', protectRoute, getConversations);

export default router;
