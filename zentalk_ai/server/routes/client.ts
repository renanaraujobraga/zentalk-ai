import express, { Request, Response } from 'express';

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: () => void): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}

/**
 * Get client dashboard
 */
router.get('/dashboard', isAuthenticated, (req: Request, res: Response): void => {
  res.json({
    dashboard: {
      userId: req.user?.userId,
      agents: [],
      usage: 0,
      plan: 'starter',
    },
  });
});

/**
 * Get client profile
 */
router.get('/profile', isAuthenticated, (req: Request, res: Response): void => {
  res.json({
    profile: {
      userId: req.user?.userId,
      email: req.user?.email,
    },
  });
});

export default router;
