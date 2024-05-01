const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const rootUserInDb = async () => {
  const rootUser = await User.findOne({ username: 'root' })

  return rootUser.toJSON()
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
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  rootUserInDb,
  createToken
}