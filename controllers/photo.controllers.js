import Photo from '../models/photo.models.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js'

const VALID_SLOTS = ['hero-1', 'hero-2', 'hero-3', 'hero-4', 'about', 'logo']

const clampNum = (v, min, max, fallback) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

const photoOut = (p) => ({ slotId: p.slotId, url: p.url, name: p.name, cropX: p.cropX, cropY: p.cropY, zoom: p.zoom })

export const getPhotos = async (req, res, next) => {
  try {
    const photos = await Photo.find()
    const data = {}
    photos.forEach(p => { data[p.slotId] = photoOut(p) })
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export const uploadPhoto = async (req, res, next) => {
  try {
    const { slotId } = req.params
    if (!VALID_SLOTS.includes(slotId)) {
      return res.status(400).json({ success: false, message: 'Invalid slot ID' })
    }

    // No new file — this is a drag/zoom position update for the existing photo.
    if (!req.file) {
      if (req.body.cropX === undefined) {
        return res.status(400).json({ success: false, message: 'No image file provided' })
      }
      const photo = await Photo.findOneAndUpdate(
        { slotId },
        {
          cropX: clampNum(req.body.cropX, 0, 100, 50),
          cropY: clampNum(req.body.cropY, 0, 100, 50),
          zoom: clampNum(req.body.zoom, 1, 3, 1),
        },
        { returnDocument: 'after' }
      )
      if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' })
      return res.json({ success: true, data: photoOut(photo) })
    }

    const existing = await Photo.findOne({ slotId })
    if (existing?.publicId) await deleteFromCloudinary(existing.publicId).catch(() => {})

    const result = await uploadToCloudinary(req.file.buffer, 'gurkha-lotus/photos')

    const photo = await Photo.findOneAndUpdate(
      { slotId },
      { url: result.secure_url, publicId: result.public_id, name: req.file.originalname, cropX: 50, cropY: 50, zoom: 1 },
      { upsert: true, returnDocument: 'after' }
    )

    res.json({ success: true, data: photoOut(photo) })
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
