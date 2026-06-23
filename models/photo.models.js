import mongoose from 'mongoose'

const SLOTS = ['hero-1', 'hero-2', 'hero-3', 'hero-4', 'about', 'logo']

const photoSchema = new mongoose.Schema({
  slotId:   { type: String, required: true, unique: true, enum: SLOTS },
  url:      { type: String, required: true },
  publicId: { type: String, required: true },
  name:     { type: String, default: '' },
  cropX:    { type: Number, default: 50, min: 0, max: 100 },
  cropY:    { type: Number, default: 50, min: 0, max: 100 },
  zoom:     { type: Number, default: 1, min: 1, max: 3 },
}, { timestamps: true })

photoSchema.set('toJSON', {
  virtuals: true,
  transform: (_, obj) => { delete obj._id; delete obj.__v },
})

export default mongoose.model('Photo', photoSchema)
