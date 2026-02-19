import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authRequired(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.toLowerCase().startsWith('bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = header.slice('bearer '.length).trim();
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
