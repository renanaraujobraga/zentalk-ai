import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { verifyToken, JWTPayload } from './auth'
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'
import clientRoutes from './routes/client'
import clientsRoutes from './routes/clients'
import agentsRoutes from './routes/agents'
import vouchersRoutes from './routes/vouchers'
import whatsappRoutes from './routes/whatsapp'

// Load .env only in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Extend Express Request with user data
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

// Auth middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (token) {
    const decoded = verifyToken(token)
    if (decoded) {
      req.user = decoded
    }
  }
  
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/client', clientRoutes)
app.use('/api/whatsapp', whatsappRoutes)
app.use('/api/clients', clientsRoutes)
app.use('/api/agents', agentsRoutes)
app.use('/api/vouchers', vouchersRoutes)

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static files
const distPath = path.join(__dirname, '../dist')
app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8')
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8')
    }
  }
}))

// SPA fallback - serve index.html for all non-API routes (but not /api/*)
app.get('*', (req: Request, res: Response) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.sendFile(path.join(distPath, 'index.html'))
})

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`📝 API available at http://localhost:${PORT}/api`)
  console.log(`🌐 Frontend available at http://localhost:${PORT}`)
})
