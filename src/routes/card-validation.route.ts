import { Router } from 'express';
import { validateCardInput } from '../middlewares/card-validation.middleware';
import { validateCard } from '../controllers/card-validation.controller';

const router = Router();

// Route to validate card information
router.post('/validate-card', validateCardInput, validateCard);

export default router;