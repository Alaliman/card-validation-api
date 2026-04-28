import { Router } from 'express';
import { validateCard } from '../controllers/card-validation.controller';

const router = Router();

router.post('/validate-card', validateCard);

export default router;