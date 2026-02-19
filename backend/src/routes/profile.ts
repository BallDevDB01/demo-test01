import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authRequired, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

export const profileRouter = Router();

profileRouter.get('/me', authRequired, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId).select('-passwordHash');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json({ user });
});

profileRouter.put(
  '/me',
  authRequired,
  [
    body('firstName').optional().isString().trim().notEmpty(),
    body('lastName').optional().isString().trim().notEmpty(),
    body('phone').optional().isString().trim()
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { firstName, lastName, phone } = req.body as {
      firstName?: string;
      lastName?: string;
      phone?: string;
    };

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { ...(firstName !== undefined ? { firstName } : {}), ...(lastName !== undefined ? { lastName } : {}), ...(phone !== undefined ? { phone } : {}) } },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  }
);
