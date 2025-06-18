import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import connectDB from './config/database';
import { userAuth } from './middlewares/auth';
import authRouter from './routes/auth';
import profileRouter from './routes/profile';
import requestRouter from './routes/request';
import userRouter from './routes/user';
import chatRouter from './routes/chat';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './utils/cronjob';
import initializeSocket from './utils/socket';

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', chatRouter);

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running');
});

// Database connection
connectDB()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err: Error) => {
    console.error('Database connection failed:', err);
  });

// Initialize server
const server: Server = new Server(app);
initializeSocket(server);

server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
}); 