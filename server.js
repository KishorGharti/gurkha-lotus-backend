import express from 'express'
import { connectdb } from './utils/mongoosedb.js'
import 'dotenv/config'
import app from './app.js'

connectdb()
app.listen(process.env.PORT, () => {
  console.log('Server is running')
})
