import express, { Request, Response } from 'express'
import { db } from '../db'
import { agents } from '../../drizzle/schema'
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
 * Get all agents for a client
 */
router.get('/', requireAuth, (_req: Request, res: Response): void => {
  try {
    const allAgents = db.select().from(agents).all()
    res.json({ agents: allAgents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    res.status(500).json({ error: 'Failed to fetch agents' })
  }
})

/**
 * Get agent by ID
 */
router.get('/:id', requireAuth, (req: Request, res: Response): void => {
  try {
    const { id } = req.params
    const agent = db.select().from(agents).where(eq(agents.id, parseInt(id))).get()

    if (!agent) {
      res.status(404).json({ error: 'Agent not found' })
      return
    }

    res.json({ agent })
  } catch (error) {
    console.error('Error fetching agent:', error)
    res.status(500).json({ error: 'Failed to fetch agent' })
  }
})

/**
 * Create new agent
 */
router.post('/', requireAuth, (req: Request, res: Response): void => {
  try {
    const { clientId, name, type, description, status } = req.body

    if (!clientId || !name || !type) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const now = Math.floor(Date.now() / 1000)

    db.insert(agents).values({
      clientId,
      name,
      type,
      description: description || '',
      status: status || 'active',
      createdAt: now,
      updatedAt: now,
    }).run()

    const newAgent = db.select().from(agents).where(eq(agents.name, name)).get()

    res.status(201).json({
      message: 'Agent created successfully',
      agent: newAgent,
    })
  } catch (error) {
    console.error('Error creating agent:', error)
    res.status(500).json({ error: 'Failed to create agent' })
  }
})

/**
 * Update agent
 */
router.put('/:id', requireAuth, (req: Request, res: Response): void => {
  try {
    const { id } = req.params
    const { name, type, description, status } = req.body

    const now = Math.floor(Date.now() / 1000)

    db.update(agents)
      .set({
        ...(name && { name }),
        ...(type && { type }),
        ...(description && { description }),
        ...(status && { status }),
        updatedAt: now,
      })
      .where(eq(agents.id, parseInt(id)))
      .run()

    const updated = db.select().from(agents).where(eq(agents.id, parseInt(id))).get()

    res.json({
      message: 'Agent updated successfully',
      agent: updated,
    })
  } catch (error) {
    console.error('Error updating agent:', error)
    res.status(500).json({ error: 'Failed to update agent' })
  }
})

/**
 * Delete agent
 */
router.delete('/:id', requireAuth, (req: Request, res: Response): void => {
  try {
    const { id } = req.params

    db.delete(agents).where(eq(agents.id, parseInt(id))).run()

    res.json({ message: 'Agent deleted successfully' })
  } catch (error) {
    console.error('Error deleting agent:', error)
    res.status(500).json({ error: 'Failed to delete agent' })
  }
})

export default router
