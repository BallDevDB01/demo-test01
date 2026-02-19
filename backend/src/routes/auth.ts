import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';

export const authRouter = Router();

authRouter.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6 }),
    body('firstName').isString().trim().notEmpty(),
    body('lastName').isString().trim().notEmpty(),
    body('phone').optional().isString().trim()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, firstName, lastName, phone } = req.body as {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
      };

      const existing = await User.findOne({ email });
      if (existing) {
        res.status(409).json({ message: 'Email already exists' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, passwordHash, firstName, lastName, phone });

      const signOptions: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
      const token = jwt.sign({ userId: user._id.toString() }, env.jwtSecret, signOptions);
      res.status(201).json({ token });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

authRouter.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body as { email: string; password: string };

      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const signOptions: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
      const token = jwt.sign({ userId: user._id.toString() }, env.jwtSecret, signOptions);
      res.json({ token });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);
