import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function serveStatic(app: express.Application): void {
  const distPath = path.join(__dirname, '../dist')
  
  // Serve static files
  app.use(express.static(distPath))
  
  // SPA fallback - serve index.html for all routes
  app.get('*', (_req: express.Request, res: express.Response) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}
