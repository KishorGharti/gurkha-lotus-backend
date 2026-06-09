import express from 'express'
import { rateLimit } from 'express-rate-limit'
import { login, logout, me } from '../controllers/auth.controllers.js'
import { authMiddleware } from '../middllewares/auth.middlerwares.js'

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
})

router.post('/login', loginLimiter, login)
router.post('/logout', authMiddleware, logout)
router.get('/me', authMiddleware, me)

export default router
