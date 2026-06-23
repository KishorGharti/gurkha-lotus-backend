import 'dotenv/config'
import mongoose from 'mongoose'
import cloudinary, { EAGER_TRANSFORMS } from './cloudinary.js'
import Photo from '../models/photo.models.js'

async function run() {
  await mongoose.connect(process.env.URL)
  const photos = await Photo.find()

  for (const photo of photos) {
    try {
      await cloudinary.uploader.explicit(photo.publicId, {
        type: 'upload',
        eager: EAGER_TRANSFORMS,
        eager_async: true,
      })
      console.log(`Queued eager transforms for ${photo.slotId} (${photo.publicId})`)
    } catch (err) {
      console.error(`Failed for ${photo.slotId} (${photo.publicId}):`, err.message)
    }
  }

  await mongoose.disconnect()
}

run()
