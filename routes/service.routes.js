import express from 'express'
import { getServices, createService, updateService, deleteService } from '../controllers/service.controllers.js'
import { authMiddleware } from '../middllewares/auth.middlerwares.js'

const router = express.Router()

router.get('/', getServices)
router.post('/', authMiddleware, createService)
router.put('/:id', authMiddleware, updateService)
router.delete('/:id', authMiddleware, deleteService)

export default router
