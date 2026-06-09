import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import authRoutes    from './routes/auth.routes.js'
import serviceRoutes from './routes/service.routes.js'
import teamRoutes    from './routes/team.routes.js'
import photoRoutes   from './routes/photo.routes.js'
import { errorMiddleware } from './middllewares/error.middlewares.js'
import { sanitizeInput } from './middllewares/sanitize.middleware.js'
import 'dotenv/config'

const app = express()

// Required behind a reverse proxy (Render/Heroku/Nginx) so rate-limit and
// secure cookies see the real client IP/protocol via X-Forwarded-* headers
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use(sanitizeInput)

// Global rate limit — 200 requests per 15 min per IP
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }))

app.use('/api/auth',     authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/team',     teamRoutes)
app.use('/api/photos',   photoRoutes)

app.use(errorMiddleware)

export default app
