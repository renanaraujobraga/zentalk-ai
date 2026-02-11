import express, { Request, Response } from 'express';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: () => void): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' })
    return
  }
  next()
}

/**
 * Get admin dashboard stats
 */
router.get('/dashboard', isAdmin, (_req: Request, res: Response) => {
  res.json({
    stats: {
      totalUsers: 0,
      totalRevenue: 0,
      activeInfluencers: 0,
      pendingVouchers: 0,
    },
  });
});

/**
 * Get all users
 */
router.get('/users', isAdmin, (_req: Request, res: Response) => {
  res.json({ users: [] });
});

/**
 * Get all influencers
 */
router.get('/influencers', isAdmin, (_req: Request, res: Response) => {
  res.json({ influencers: [] });
});

export default router;
