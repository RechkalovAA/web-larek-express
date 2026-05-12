import { Router } from 'express';

import { createProduct, getProductById, getProducts } from '../controllers/products';
import { validateCreateProductBody, validateProductIdParam } from '../middlewares/validation';

const router = Router();

router.get('/', getProducts);
router.post('/', validateCreateProductBody, createProduct);
router.get('/:productId', validateProductIdParam, getProductById);

export default router;
