import Photo from '../models/photo.models.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js'

const VALID_SLOTS = ['hero-1', 'hero-2', 'hero-3', 'hero-4', 'about']

export const getPhotos = async (req, res, next) => {
  try {
    const photos = await Photo.find()
    const data = {}
    photos.forEach(p => { data[p.slotId] = { url: p.url, name: p.name } })
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export const uploadPhoto = async (req, res, next) => {
  try {
    const { slotId } = req.params
    if (!VALID_SLOTS.includes(slotId)) {
      return res.status(400).json({ success: false, message: 'Invalid slot ID' })
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' })
    }

    const existing = await Photo.findOne({ slotId })
    if (existing?.publicId) await deleteFromCloudinary(existing.publicId).catch(() => {})

    const result = await uploadToCloudinary(req.file.buffer, 'gurkha-lotus/photos')

    const photo = await Photo.findOneAndUpdate(
      { slotId },
      { url: result.secure_url, publicId: result.public_id, name: req.file.originalname },
      { upsert: true, new: true }
    )

    res.json({ success: true, data: { slotId: photo.slotId, url: photo.url, name: photo.name } })
  } catch (err) { next(err) }
}

export const deletePhoto = async (req, res, next) => {
  try {
    const { slotId } = req.params
    if (!VALID_SLOTS.includes(slotId)) {
      return res.status(400).json({ success: false, message: 'Invalid slot ID' })
    }
    const photo = await Photo.findOneAndDelete({ slotId })
    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' })
    if (photo.publicId) await deleteFromCloudinary(photo.publicId).catch(() => {})
    res.json({ success: true, message: 'Photo removed' })
  } catch (err) { next(err) }
}
