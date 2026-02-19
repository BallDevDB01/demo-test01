import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { env } from './config/env';
import { authRouter } from './routes/auth';
import { profileRouter } from './routes/profile';

async function main(): Promise<void> {
  await mongoose.connect(env.mongoUri);

  const app = express();
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/profile', profileRouter);

  const webDir = path.resolve(__dirname, '../../web');
  app.use(express.static(webDir));
  app.get('*', (req: Request, res: Response) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.sendFile(path.join(webDir, 'index.html'));
  });

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on port ${env.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
