const jwt = require('jsonwebtoken')

const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length
}

const isStrongPassword = (password) => {
  const lowercaseRegex = /[a-z]/
  const uppercaseRegex = /[A-Z]/
  const digitRegex = /[0-9]/
  const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/

  if (password.length < 8 ||
    !lowercaseRegex.test(password) ||
    !uppercaseRegex.test(password) ||
    !digitRegex.test(password) ||
    !specialCharRegex.test(password)) {

    return {
      status: false,
      message: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.'
    }
  }

  return {
    status: true,
    message: 'Password is strong.'
  }
}

const createToken = (user) => {
  const userForToken = {
    username: user.username,
    id: user.id
  }
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }// token expires in 60*60 seconds, that is, in one hour
  )

  return token
}

module.exports = {
  reverse,
  average,
  isStrongPassword,
  createToken
}