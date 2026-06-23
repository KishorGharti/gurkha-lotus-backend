import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'

cloudinary.config({
  cloud_name:  process.env.CLOUD_NAME,
  api_key:     process.env.CLOUD_API_KEY,
  api_secret:  process.env.CLOUD_API_SECRET,
})

export const SLOT_BASE_WIDTH = {
  'hero-1': 1920, 'hero-2': 1920, 'hero-3': 1920, 'hero-4': 1920,
  about: 900,
}

export const zoomedWidth = (baseWidth, zoom = 1) => Math.ceil((baseWidth * (zoom || 1)) / 100) * 100

export const buildEagerTransforms = (baseWidth, zoom = 1) => [
  { width: zoomedWidth(baseWidth, zoom), fetch_format: 'auto', quality: 'auto', dpr: 'auto' },
  { width: 40, fetch_format: 'auto', quality: 1, effect: 'blur:2000' },
]

export const uploadToCloudinary = (buffer, folder, eager) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', eager, eager_async: true },
      (error, result) => (error ? reject(error) : resolve(result))
    )
    stream.end(buffer)
  })

export const warmEagerTransform = (publicId, eager) =>
  cloudinary.uploader.explicit(publicId, { type: 'upload', eager, eager_async: true })

export const deleteFromCloudinary = (publicId) =>
  cloudinary.uploader.destroy(publicId)

export default cloudinary
