import multer from 'multer'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, 
  fileFilter: (_req, file, cb) => {
    ALLOWED_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(Object.assign(new Error('Only JPG, PNG, or WebP images are allowed'), { status: 400 }))
  },
})
