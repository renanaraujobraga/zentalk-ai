import express, { Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../db'
import { users } from '../../drizzle/schema'
import { hashPassword, verifyPassword, generateToken, generateVerificationToken } from '../auth'
import { createTrialSubscription } from '../services/subscription'
import { eq } from 'drizzle-orm'

const router = express.Router()

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

/**
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = registerSchema.parse(req.body)

    // Check if user already exists
    const existingUser = db.select().from(users).where(eq(users.email, email)).get()

    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' })
      return
    }

    // Create new user
    const passwordHash = hashPassword(password)
    const verificationToken = generateVerificationToken()
    const now = Math.floor(Date.now() / 1000)

    db.insert(users).values({
      email,
      passwordHash,
      name,
      role: 'user',
      status: 'active',
      emailVerified: false,
      verificationToken,
      createdAt: now,
      updatedAt: now,
    }).run()

    const newUser = db.select().from(users).where(eq(users.email, email)).get()

    // Create trial subscription
    if (newUser) {
      await createTrialSubscription(newUser.id, name)
    }

    res.status(201).json({
      message: 'User created successfully with 7-day free trial',
      user: {
        id: newUser?.id,
        email: newUser?.email,
        name: newUser?.name,
        role: newUser?.role,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors })
      return
    }
    console.error('Register error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Login user
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    // Find user
    const user = db.select().from(users).where(eq(users.email, email)).get()

    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    // Update last signed in
    const now = new Date()
    db.update(users)
      .set({ lastSignedIn: now })
      .where(eq(users.id, user.id))
      .run()

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'admin' | 'user' | 'influencer',
    })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors })
      return
    }
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Get current user
 */
router.get('/me', (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  res.json({ user: req.user })
})

export default router
