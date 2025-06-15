import express from 'express';
import { getRequests, createRequest } from '../controllers/requests.controller';

const router = express.Router();

// Добавляем middleware для парсинга JSON
router.use(express.json());

router.get('/', getRequests);
router.post('/', createRequest);

export default router;