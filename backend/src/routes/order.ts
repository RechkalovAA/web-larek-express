import { Router } from 'express';

import createOrder from '../controllers/order';
import { validateCreateOrderBody } from '../middlewares/validation';

const router = Router();

router.post('/', validateCreateOrderBody, createOrder);

export default router;
