import express from 'express'
import { getPhotos, uploadPhoto, deletePhoto } from '../controllers/photo.controllers.js'
import { authMiddleware } from '../middllewares/auth.middlerwares.js'
import { upload } from '../middllewares/upload.middleware.js'

const router = express.Router()

router.get('/', getPhotos)
router.post('/:slotId', authMiddleware, upload.single('image'), uploadPhoto)
router.delete('/:slotId', authMiddleware, deletePhoto)

export default router
