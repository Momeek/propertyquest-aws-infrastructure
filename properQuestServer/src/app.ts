// src/app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/api/properties', (req: Request, res: Response) => {
  res.json({
    message: "Route works!",
    data: [
      { id: 1, name: "Luxury Villa", location: "Abuja" },
      { id: 2, name: "Apartment Suite", location: "Lagos" }
    ]
  });
});

// Catch-all 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Unsupported route/method" });
});

export default app;

