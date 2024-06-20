import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import noteService from './services/notes'
import loginService from './services/login'
import './index.css'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [typeMessage, setTypeMessage] = useState('success')
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()
  const localStorageUserLoggedKey = 'loggedNoteappUser'

  useEffect(() => {
    noteService.getAll()
      .then(initialNotes => {
        notificationMessage('Saved notes were loaded', 'success')
        setNotes(initialNotes)
      }).catch(error => {
        notificationMessage('Problem to load saved message from server', 'error')
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(localStorageUserLoggedKey)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])//The empty array as the parameter of the effect ensures that the effect is executed only when the component is rendered for the first time.

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        notificationMessage(`Added ${returnedNote.content}`, 'success')
        setNotes(notes.concat(returnedNote))
      }).catch(error => {
        notificationMessage(`Note '${noteObject.content}' was not created`, 'error')
        if (error.response.status === 401) handleLogout()
      })
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
        setNotes(notes.filter(n => n.id !== id))
        notificationMessage(`Deleted ${content}`, 'success')
      }).catch(error => {
        notificationMessage(`The note '${content}' was already deleted from server before.`, 'error')
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleLogin = async (loginObject) => {
    try {
      const loggedUser = await loginService.login(loginObject)
      window.localStorage.setItem(localStorageUserLoggedKey, JSON.stringify(loggedUser))
      noteService.setToken(loggedUser.token)
      setUser(loggedUser)
      notificationMessage(`User ${loggedUser.name} logged in.`, 'success')
    } catch (exception) {
      notificationMessage('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(localStorageUserLoggedKey)
    setUser(null)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} typeMessage={typeMessage} />

      { user === null
        ?
        <Togglable buttonLabel='log in'>
          <LoginForm handleLogin={ handleLogin } />
        </Togglable>
        :
        <div>
          <p>{user.name} logged-in</p>
          <Togglable buttonLabel='new note' ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>
          <button onClick={handleLogout}>Logout</button>
        </div>
      }

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

      <Footer/>
    </div>
  )
}

export default App