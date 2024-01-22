require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')
app.use(express.json())
app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//The code automatically uses the defined toJSON when formatting notes to the response.
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

// app.delete('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   notes = notes.filter(note => note.id !== id)

//   response.status(204).end()
// })
