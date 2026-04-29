import express, { Request, Response} from 'express';
import cors from 'cors';
import cardRoutes from './routes/card-validation.route';


const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cardRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is awake and running',
    note: 'This API is hosted on a free tier. If your first request was slow, the server was waking up. Subsequent requests will be fast.'
  });
});

export default app;