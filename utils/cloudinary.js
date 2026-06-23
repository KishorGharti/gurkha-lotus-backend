import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'

cloudinary.config({
  cloud_name:  process.env.CLOUD_NAME,
  api_key:     process.env.CLOUD_API_KEY,
  api_secret:  process.env.CLOUD_API_SECRET,
})

export const EAGER_TRANSFORMS = [
  { width: 1920, fetch_format: 'auto', quality: 'auto', dpr: 'auto' },
  { width: 900,  fetch_format: 'auto', quality: 'auto', dpr: 'auto' },
  { width: 40,   fetch_format: 'auto', quality: 1, effect: 'blur:2000' },
]

export const uploadToCloudinary = (buffer, folder = 'gurkha-lotus') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', eager: EAGER_TRANSFORMS, eager_async: true },
      (error, result) => (error ? reject(error) : resolve(result))
    )
    stream.end(buffer)
  })

export const deleteFromCloudinary = (publicId) =>
  cloudinary.uploader.destroy(publicId)

export default cloudinary
