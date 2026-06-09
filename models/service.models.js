import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  title:       { type: String, required: true, maxlength: 150 },
  description: { type: String, required: true, maxlength: 3000 },
  features:    [{ type: String, maxlength: 50 }],
  order:       { type: Number, default: 0 },
}, { timestamps: true })

serviceSchema.set('toJSON', {
  virtuals: true,
  transform: (_, obj) => { delete obj._id; delete obj.__v },
})

export default mongoose.model('Service', serviceSchema)
