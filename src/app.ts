import express from 'express';
import cardRoutes from './routes/card-validation.route';
const app = express();

app.use(express.json());

app.use('/api', cardRoutes);

export default app;