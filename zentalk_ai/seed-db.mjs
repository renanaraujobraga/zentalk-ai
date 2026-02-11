import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'zentalk.db')

const db = new Database(dbPath)
db.pragma('foreign_keys = ON')

async function seedDatabase() {
  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('Governo1212', 10)
    const userPassword = await bcrypt.hash('Governo1212', 10)

    // Create admin user
    const adminInsert = db.prepare(`
      INSERT INTO users (email, password_hash, name, role, status, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const now = Math.floor(Date.now() / 1000)

    adminInsert.run(
      'renanbraga@yahoo.com.br',
      adminPassword,
      'Renan Braga',
      'admin',
      'active',
      1,
      now,
      now
    )

    console.log('✅ Admin user created: renanbraga@yahoo.com.br')

    // Create regular user
    adminInsert.run(
      'nancarioca@gmail.com',
      userPassword,
      'Nancy Carioca',
      'user',
      'active',
      1,
      now,
      now
    )

    console.log('✅ Regular user created: nancarioca@gmail.com')

    // Create client profile for regular user
    const userIdQuery = db.prepare('SELECT id FROM users WHERE email = ?')
    const userId = userIdQuery.get('nancarioca@gmail.com').id

    const clientInsert = db.prepare(`
      INSERT INTO clients (user_id, company_name, plan, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    clientInsert.run(
      userId,
      'Nancy Carioca Consultoria',
      'starter',
      'active',
      now,
      now
    )

    console.log('✅ Client profile created for nancarioca@gmail.com')

    console.log('\n✨ Database seeding completed successfully!')
    console.log('\nTest credentials:')
    console.log('Admin: renanbraga@yahoo.com.br / Governo1212')
    console.log('User: nancarioca@gmail.com / Governo1212')
  } catch (error) {
    console.error('❌ Error seeding database:', error.message)
    process.exit(1)
  } finally {
    db.close()
  }
}

seedDatabase()
