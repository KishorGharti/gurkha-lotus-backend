import 'dotenv/config'
import mongoose from 'mongoose'
import { warmEagerTransform, buildEagerTransforms, SLOT_BASE_WIDTH } from './cloudinary.js'
import Photo from '../models/photo.models.js'

async function run() {
  await mongoose.connect(process.env.URL)
  const photos = await Photo.find()

  for (const photo of photos) {
    const baseWidth = SLOT_BASE_WIDTH[photo.slotId]
    if (!baseWidth) continue
    try {
      await warmEagerTransform(photo.publicId, buildEagerTransforms(baseWidth, photo.zoom))
      console.log(`Queued eager transforms for ${photo.slotId} (zoom ${photo.zoom}) (${photo.publicId})`)
    } catch (err) {
      console.error(`Failed for ${photo.slotId} (${photo.publicId}):`, err.message)
    }
  }

  await mongoose.disconnect()
}

run()
