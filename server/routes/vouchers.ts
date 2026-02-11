import express, { Request, Response } from 'express'
import { db } from '../db'
import { vouchers } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// Middleware para verificar autenticação
const requireAuth = (req: Request, res: Response, next: () => void): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}

/**
 * Get all vouchers
 */
router.get('/', requireAuth, (_req: Request, res: Response): void => {
  try {
    const allVouchers = db.select().from(vouchers).all()
    res.json({ vouchers: allVouchers })
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    res.status(500).json({ error: 'Failed to fetch vouchers' })
  }
})

/**
 * Get voucher by ID
 */
router.get('/:id', requireAuth, (req: Request, res: Response): void => {
  try {
    const { id } = req.params
    const voucher = db.select().from(vouchers).where(eq(vouchers.id, parseInt(id))).get()

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' })
      return
    }

    res.json({ voucher })
  } catch (error) {
    console.error('Error fetching voucher:', error)
    res.status(500).json({ error: 'Failed to fetch voucher' })
  }
})

/**
 * Create new voucher
 */
router.post('/', requireAuth, (req: Request, res: Response): void => {
  try {
    const { code, discount, expiresAt, maxUses, status } = req.body

    if (!code || discount === undefined) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const now = Math.floor(Date.now() / 1000)

    db.insert(vouchers).values({
      code,
      discount,
      expiresAt: expiresAt || null,
      maxUses: maxUses || null,
      usedCount: 0,
      status: status || 'active',
      createdAt: now,
      updatedAt: now,
    }).run()

    const newVoucher = db.select().from(vouchers).where(eq(vouchers.code, code)).get()

    res.status(201).json({
      message: 'Voucher created successfully',
      voucher: newVoucher,
    })
  } catch (error) {
    console.error('Error creating voucher:', error)
    res.status(500).json({ error: 'Failed to create voucher' })
  }
})

/**
 * Update voucher
 */
router.put('/:id', requireAuth, (req: Request, res: Response): void => {
  try {
    const { id } = req.params
    const { code, discount, expiresAt, maxUses, status } = req.body

    const now = Math.floor(Date.now() / 1000)

    db.update(vouchers)
      .set({
        ...(code && { code }),
        ...(discount !== undefined && { discount }),
        ...(expiresAt && { expiresAt }),
        ...(maxUses && { maxUses }),
        ...(status && { status }),
        updatedAt: now,
      })
      .where(eq(vouchers.id, parseInt(id)))
      .run()

    const updated = db.select().from(vouchers).where(eq(vouchers.id, parseInt(id))).get()

    res.json({
      message: 'Voucher updated successfully',
      voucher: updated,
    })
  } catch (error) {
    console.error('Error updating voucher:', error)
    res.status(500).json({ error: 'Failed to update voucher' })
  }
})

/**
 * Delete voucher
 */
router.delete('/:id', requireAuth, (req: Request, res: Response): void => {
  try {
    const { id } = req.params

    db.delete(vouchers).where(eq(vouchers.id, parseInt(id))).run()

    res.json({ message: 'Voucher deleted successfully' })
  } catch (error) {
    console.error('Error deleting voucher:', error)
    res.status(500).json({ error: 'Failed to delete voucher' })
  }
})

/**
 * Validate and use voucher
 */
router.post('/:id/use', requireAuth, (req: Request, res: Response): void => {
  try {
    const { id } = req.params
    const voucher = db.select().from(vouchers).where(eq(vouchers.id, parseInt(id))).get()

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' })
      return
    }

    if (voucher.status !== 'active') {
      res.status(400).json({ error: 'Voucher is not active' })
      return
    }

    if (voucher.maxUses && voucher.usedCount >= voucher.maxUses) {
      res.status(400).json({ error: 'Voucher usage limit reached' })
      return
    }

    const now = Math.floor(Date.now() / 1000)
    if (voucher.expiresAt && voucher.expiresAt < now) {
      res.status(400).json({ error: 'Voucher has expired' })
      return
    }

    // Increment used count
    db.update(vouchers)
      .set({
        usedCount: (voucher.usedCount || 0) + 1,
        updatedAt: now,
      })
      .where(eq(vouchers.id, parseInt(id)))
      .run()

    res.json({
      message: 'Voucher used successfully',
      discount: voucher.discount,
    })
  } catch (error) {
    console.error('Error using voucher:', error)
    res.status(500).json({ error: 'Failed to use voucher' })
  }
})

export default router
