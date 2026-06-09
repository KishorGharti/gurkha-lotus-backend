import Service from '../models/service.models.js'

const TITLE_WORD_LIMIT = 10
const DESCRIPTION_WORD_LIMIT = 300

const limitWords = (text, max) => text.trim().split(/\s+/).slice(0, max).join(' ')

export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 })
    res.json({ success: true, data: services })
  } catch (err) { next(err) }
}

export const createService = async (req, res, next) => {
  try {
    const { title, description, features } = req.body
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ success: false, message: 'Title and description are required' })
    }
    const service = await Service.create({
      title:       limitWords(title, TITLE_WORD_LIMIT),
      description: limitWords(description, DESCRIPTION_WORD_LIMIT),
      features:    (features || []).map(f => f.trim()).filter(Boolean).slice(0, 8),
    })
    res.status(201).json({ success: true, data: service })
  } catch (err) { next(err) }
}

export const updateService = async (req, res, next) => {
  try {
    const { title, description, features } = req.body
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ success: false, message: 'Title and description are required' })
    }
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title:       limitWords(title, TITLE_WORD_LIMIT),
        description: limitWords(description, DESCRIPTION_WORD_LIMIT),
        features:    (features || []).map(f => f.trim()).filter(Boolean).slice(0, 8),
      },
      { new: true, runValidators: true }
    )
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true, data: service })
  } catch (err) { next(err) }
}

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true, message: 'Service deleted' })
  } catch (err) { next(err) }
}
