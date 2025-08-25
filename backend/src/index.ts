import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import authRouter from './routes/auth';
import vehicleRouter from './routes/vehicle';
import { loggingMiddleware } from './middleware/logging.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import env from './config/env';
import { setupSwagger } from './swagger';

const app = express();
const port = env.port;

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from the frontend
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.use(loggingMiddleware);

setupSwagger(app);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/auth', authRouter);
app.use('/api/vehicles', vehicleRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };