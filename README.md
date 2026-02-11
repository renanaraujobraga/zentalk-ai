# Zentalk.AI - Intelligent Customer Service Platform

AI-powered customer service platform with WhatsApp integration, multi-language support, and real-time analytics.

## 🚀 Features

- **Multi-language Support**: Portuguese, English, and Spanish
- **WhatsApp Integration**: Automated messaging and conversation management
- **AI-Powered Agents**: Intelligent responses using LLM
- **Admin Dashboard**: Complete management system
- **Client Portal**: Self-service dashboard for clients
- **Real-time Analytics**: WebSocket-powered live updates
- **7-Day Free Trial**: No credit card required
- **Subscription Plans**: Flexible pricing tiers

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- TypeScript
- TailwindCSS 3
- React Router
- Zustand (State Management)
- Recharts (Data Visualization)
- Socket.io Client

**Backend:**
- Node.js + Express
- TypeScript
- SQLite + Drizzle ORM
- JWT Authentication
- Socket.io Server
- Bcrypt Password Hashing

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Setup database
pnpm drizzle-kit push

# Seed database with test users
node seed-db.mjs

# Build frontend
pnpm build
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=file:./zentalk.db
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NODE_ENV=production
PORT=3001
```

## 🚀 Running

**Development:**
```bash
# Terminal 1: Backend
PORT=3001 npx tsx server/index.ts

# Terminal 2: Frontend (optional)
pnpm dev
```

**Production:**
```bash
# Build and run
pnpm build
PORT=3001 npx tsx server/index.ts
```

## 🔐 Test Credentials

| Email | Password | Role |
|-------|----------|------|
| renanbraga@yahoo.com.br | Governo1212 | admin |
| nancarioca@gmail.com | Governo1212 | user |

## 📊 Subscription Plans

- **Starter**: $19/month (5 agents, 1k conversations)
- **Professional**: $49/month (20 agents, 10k conversations)
- **Enterprise**: $99/month (unlimited)

## 📝 License

Copyright © 2026 Zentalk.AI. All rights reserved.

## 🤝 Support

For questions or support, please contact the development team.
