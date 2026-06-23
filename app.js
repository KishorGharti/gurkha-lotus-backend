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

if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())
app.use(sanitizeInput)

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }))

app.use('/api/auth',     authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/team',     teamRoutes)
app.use('/api/photos',   photoRoutes)

app.use(errorMiddleware)

export default app
