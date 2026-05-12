import path from 'path';

import 'dotenv/config';
import { errors as celebrateErrors } from 'celebrate';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import { MONGODB_URI, PORT } from './config';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import notFoundHandler from './middlewares/not-found';
import orderRouter from './routes/order';
import productsRouter from './routes/products';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

async function bootstrap(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  // eslint-disable-next-line no-console -- startup diagnostic
  console.log('Connected to MongoDB');

  app.use(requestLogger);

  app.use('/product', productsRouter);
  app.use('/order', orderRouter);

  app.use(notFoundHandler);
  app.use(errorLogger);
  app.use(celebrateErrors());
  app.use(errorHandler);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console -- startup diagnostic
    console.log(`Server listening on port ${PORT}`);
  });
}

bootstrap().catch((err: unknown) => {
  // eslint-disable-next-line no-console -- startup diagnostic
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
