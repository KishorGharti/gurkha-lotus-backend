import express from 'express'
import { connectdb } from './utils/mongoosedb.js'
import 'dotenv/config'
import { validateEnv } from './utils/validateEnv.js'
import app from './app.js'

validateEnv()
connectdb()
app.listen(process.env.PORT, () => {
  console.log('Server is running')
})
