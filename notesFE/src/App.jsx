import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import './index.css'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [typeMessage, setTypeMessage] = useState('success')

  useEffect(() => {
    console.log('effect')
    noteService.getAll()
      .then(initialNotes => {
        notificationMessage(`Saved notes were loaded`, 'success')
        setNotes(initialNotes)
      }).catch(error => {
        notificationMessage(`Problem to load saved message from server`, 'error')
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService.create(noteObject)
      .then(returnedNote => {
        notificationMessage(`Added ${returnedNote.content}`, 'success')
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      }).catch(error => {
        notificationMessage(`Note '${noteObject.content}' was not created`, 'error')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const notificationMessage = (message, type) => {
    setTypeMessage(type)
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService.update(id, changedNote)
      .then(returnedNote => {
        notificationMessage(`Important property was updated ${note.content}`)
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
      })
      .catch(error => {
        notificationMessage(`Note '${note.content}' was already removed from server`, 'error')
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const deleteNote = (id, content) => {
    noteService.remove(id)
      .then((response) => {
        console.log('delete Note response :', response);
        setNotes(notes.filter(n => n.id !== id))
        notificationMessage(`Deleted ${content}`, 'success')
      }).catch(error => {
        console.log('delete Note error :', error);
        notificationMessage(`The note '${content}' was already deleted from server before.`, 'error')
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} typeMessage={typeMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            onDelete={deleteNote}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App 