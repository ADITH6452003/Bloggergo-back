const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req, res) => {
  try {
    const { username, email, password, mobile, dob } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
      mobile,
      dob
    })
    
    await user.save()
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    
    res.status(201).json({
      token,
      user: { id: user._id, username, email, mobile, dob }
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    
    res.json({
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        mobile: user.mobile, 
        dob: user.dob 
      }
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { username, mobile, dob } = req.body
    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, mobile, dob },
      { new: true }
    )
    
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob
      }
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob
      }
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = { register, login, updateProfile, getProfile }