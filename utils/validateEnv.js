const REQUIRED_ENV_VARS = ['URL', 'JWT_SECRET', 'CLOUD_NAME', 'CLOUD_API_KEY', 'CLOUD_API_SECRET']

export const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key])
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
