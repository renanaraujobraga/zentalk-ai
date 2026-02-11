import express, { Request, Response } from 'express'
import { db } from '../db'
import { clients } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'

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
 * Get all clients (admin only)
 */
router.get('/', requireAuth, (_req: Request, res: Response): void => {
  try {
    const allClients = db.select().from(clients).all()
    res.json({ clients: allClients })
  } catch (error) {
    console.error('Error fetching clients:', error)
    res.status(500).json({ error: 'Failed to fetch clients' })
  }
})

/**
 * Get client by ID
 */
router.get('/:id', requireAuth, (req: Request, res: Response): void => {
  try {
    const { id } = req.params
    const client = db.select().from(clients).where(eq(clients.id, parseInt(id))).get()

    if (!client) {
      res.status(404).json({ error: 'Client not found' })
      return
    }

    res.json({ client })
  } catch (error) {
    console.error('Error fetching client:', error)
    res.status(500).json({ error: 'Failed to fetch client' })
  }
})

/**
 * Create new client
 */
router.post('/', requireAuth, (req: Request, res: Response): void => {
  try {
    const { companyName, plan, status, userId } = req.body

    if (!companyName || !plan) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const now = Math.floor(Date.now() / 1000)
    const currentUserId = userId || req.user?.userId || 1

    db.insert(clients).values({
      userId: currentUserId,
      companyName,
      plan,
      status: status || 'active',
      createdAt: now,
      updatedAt: now,
    }).run()

    const newClient = db.select().from(clients).where(eq(clients.companyName, companyName)).get()

    res.status(201).json({
      message: 'Client created successfully',
      client: newClient,
    })
  } catch (error) {
    console.error('Error creating client:', error)
    res.status(500).json({ error: 'Failed to create client' })
  }
})

/**
 * Update client
 */
router.put('/:id', requireAuth, (req: Request, res: Response): void => {
  try {
    const { id } = req.params
    const { companyName, plan, status } = req.body

    const now = Math.floor(Date.now() / 1000)

    db.update(clients)
      .set({
        ...(companyName && { companyName }),
        ...(plan && { plan }),
        ...(status && { status }),
        updatedAt: now,
      })
      .where(eq(clients.id, parseInt(id)))
      .run()

    const updated = db.select().from(clients).where(eq(clients.id, parseInt(id))).get()

    res.json({
      message: 'Client updated successfully',
      client: updated,
    })
  } catch (error) {
    console.error('Error updating client:', error)
    res.status(500).json({ error: 'Failed to update client' })
  }
})

/**
 * Delete client
 */
router.delete('/:id', requireAuth, (req: Request, res: Response): void => {
  try {
    const { id } = req.params

    db.delete(clients).where(eq(clients.id, parseInt(id))).run()

    res.json({ message: 'Client deleted successfully' })
  } catch (error) {
    console.error('Error deleting client:', error)
    res.status(500).json({ error: 'Failed to delete client' })
  }
})

export default router
