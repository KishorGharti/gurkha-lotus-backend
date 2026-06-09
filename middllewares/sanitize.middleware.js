const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    value.forEach(sanitizeValue)
    return value
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete value[key]
        continue
      }
      sanitizeValue(value[key])
    }
  }
  return value
}


export const sanitizeInput = (req, _res, next) => {
  sanitizeValue(req.body)
  sanitizeValue(req.params)
  sanitizeValue(req.query)
  next()
}
