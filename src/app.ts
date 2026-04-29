import express, { Request, Response} from 'express';
import cors from 'cors';
import cardRoutes from './routes/card-validation.route';


const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cardRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is awake and running',
  });
});

export default app;