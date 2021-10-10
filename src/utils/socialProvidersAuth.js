import User from '../models/user'
import jwt from 'jsonwebtoken'

export const googleAuth = async (req, res) => {
  const {
    id,
    displayName,
    emails: [{ value }],
  } = req.user

  try {
    // Find user in the database
    const user = await User.findOne({ providerId: id })
    let token

    if (!user) {
      // User not found --> new user --> create new user in the database
      const newUser = await User.create({
        name: displayName,
        email: value,
        password: `google_${id}`,
        providerId: id,
      })
      // Send cookie to frontend
      token = jwt.sign({ userId: newUser.id }, process.env.SECRET, {
        expiresIn: '7days',
      })
    } else {
      token = jwt.sign({ userId: user.id }, process.env.SECRET, {
        expiresIn: '7days',
      })
    }
    res.cookie('jwt', token)
    res.redirect('https://client492.herokuapp.com/')
  } catch (error) {
    res.redirect('https://client492.herokuapp.com//signIn')
  }
}

export const googleAuthDriver = async (req, res) => {
  const {
    id,
    displayName,
    emails: [{ value }],
  } = req.user

  try {
    // Find user in the database
    const user = await User.findOne({ providerId: id })
    let token

    if (!user) {
      // User not found --> new user --> create new user in the database
      const newUser = await User.create({
        name: displayName,
        email: value,
        password: `google_${id}`,
        providerId: id,
      })
      // Send cookie to frontend
      token = jwt.sign({ userId: newUser.id }, process.env.SECRET, {
        expiresIn: '7days',
      })
    } else {
      token = jwt.sign({ userId: user.id }, process.env.SECRET, {
        expiresIn: '7days',
      })
    }
    res.cookie('jwt', token)
    res.redirect('https://client492.herokuapp.com/')
  } catch (error) {
    res.redirect('https://client492.herokuapp.com//signUpDriver')
  }
}