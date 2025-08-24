import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRouter from './routes/auth';
import vehicleRouter from './routes/vehicle';
import { loggingMiddleware } from './middleware/logging.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import env from './config/env';
import { setupSwagger } from './swagger';

const app = express();
const port = env.port;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

setupSwagger(app);

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