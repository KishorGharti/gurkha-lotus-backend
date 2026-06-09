import TeamMember from '../models/team.models.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js'

const getInitials = (name) =>
  name.split(' ').filter(w => /^[A-Za-z]/.test(w)).slice(0, 3).map(w => w[0].toUpperCase()).join('')

export const getTeam = async (req, res, next) => {
  try {
    const team = await TeamMember.find().sort({ order: 1, createdAt: 1 })
    res.json({ success: true, data: team })
  } catch (err) { next(err) }
}

export const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, phone, facebook, accentColor } = req.body
    if (!name?.trim() || !role?.trim()) {
      return res.status(400).json({ success: false, message: 'Name and role are required' })
    }

    let photoUrl = null, photoPublicId = null
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'gurkha-lotus/team')
      photoUrl = result.secure_url
      photoPublicId = result.public_id
    }

    const member = await TeamMember.create({
      name:         name.trim().slice(0, 80),
      role:         role.trim().slice(0, 60),
      phone:        (phone || '').trim().slice(0, 30),
      facebook:     (facebook || '').trim().slice(0, 200),
      initials:     getInitials(name.trim()),
      accentColor:  accentColor || '#1a3a1a',
      photoUrl,
      photoPublicId,
    })
    res.status(201).json({ success: true, data: member })
  } catch (err) { next(err) }
}

export const updateTeamMember = async (req, res, next) => {
  try {
    const { name, role, phone, facebook, accentColor, removePhoto } = req.body
    if (!name?.trim() || !role?.trim()) {
      return res.status(400).json({ success: false, message: 'Name and role are required' })
    }

    const existing = await TeamMember.findById(req.params.id)
    if (!existing) return res.status(404).json({ success: false, message: 'Team member not found' })

    let photoUrl = existing.photoUrl
    let photoPublicId = existing.photoPublicId

    if (req.file) {
      if (existing.photoPublicId) await deleteFromCloudinary(existing.photoPublicId).catch(() => {})
      const result = await uploadToCloudinary(req.file.buffer, 'gurkha-lotus/team')
      photoUrl = result.secure_url
      photoPublicId = result.public_id
    } else if (removePhoto === 'true') {
      if (existing.photoPublicId) await deleteFromCloudinary(existing.photoPublicId).catch(() => {})
      photoUrl = null
      photoPublicId = null
    }

    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim().slice(0, 80), role: role.trim().slice(0, 60),
        phone: (phone || '').trim().slice(0, 30), facebook: (facebook || '').trim().slice(0, 200),
        initials: getInitials(name.trim()), accentColor: accentColor || '#1a3a1a',
        photoUrl, photoPublicId,
      },
      { new: true }
    )
    res.json({ success: true, data: member })
  } catch (err) { next(err) }
}

export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id)
    if (!member) return res.status(404).json({ success: false, message: 'Team member not found' })
    if (member.photoPublicId) await deleteFromCloudinary(member.photoPublicId).catch(() => {})
    res.json({ success: true, message: 'Team member deleted' })
  } catch (err) { next(err) }
}
