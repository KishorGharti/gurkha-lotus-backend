import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  name:          { type: String, required: true, maxlength: 80 },
  role:          { type: String, required: true, maxlength: 60 },
  phone:         { type: String, default: '', maxlength: 30 },
  facebook:      { type: String, default: '', maxlength: 200 },
  initials:      { type: String, maxlength: 3 },
  accentColor:   { type: String, default: '#1a3a1a' },
  photoUrl:      { type: String, default: null },
  photoPublicId: { type: String, default: null },
  cropX:         { type: Number, default: 50, min: 0, max: 100 },
  cropY:         { type: Number, default: 50, min: 0, max: 100 },
  zoom:          { type: Number, default: 1, min: 1, max: 3 },
  order:         { type: Number, default: 0 },
}, { timestamps: true })

teamSchema.set('toJSON', {
  virtuals: true,
  transform: (_, obj) => { delete obj._id; delete obj.__v },
})

export default mongoose.model('TeamMember', teamSchema)
