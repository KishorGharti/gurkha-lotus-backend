import Admin from '../models/admin.models.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:2 * 60 * 60 * 1000,
  }

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' })
    }

    const admin = await Admin.findOne({ username: username.trim() })
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, { expiresIn: '2h' })
    res.cookie('token', token, COOKIE_OPTS)
    res.status(200).json({ success: true, message: 'Login successful' })
  } catch (err) {
    next(err)
  }
}

export const logout = (_req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
  res.status(200).json({ success: true, message: 'Logged out' })
}

export const me = (req, res) => {
  res.status(200).json({ success: true, userId: req.user.userId })
}
