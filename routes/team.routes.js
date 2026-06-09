import express from 'express'
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/team.controllers.js'
import { authMiddleware } from '../middllewares/auth.middlerwares.js'
import { upload } from '../middllewares/upload.middleware.js'

const router = express.Router()

router.get('/', getTeam)
router.post('/', authMiddleware, upload.single('photo'), createTeamMember)
router.put('/:id', authMiddleware, upload.single('photo'), updateTeamMember)
router.delete('/:id', authMiddleware, deleteTeamMember)

export default router
