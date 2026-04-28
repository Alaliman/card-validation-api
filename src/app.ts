import express from 'express';
import cors from 'cors';
import cardRoutes from './routes/card-validation.route';


const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cardRoutes);

export default app;