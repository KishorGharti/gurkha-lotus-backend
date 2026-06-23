let cache = null

export const getPhotoCache = () => cache
export const setPhotoCache = (data) => { cache = data }
export const clearPhotoCache = () => { cache = null }
