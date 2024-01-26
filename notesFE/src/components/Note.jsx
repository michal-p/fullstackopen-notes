const Note = ({ note, toggleImportance, onDelete }) => {
  const label = note.important ? 'not important' : 'important'

  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={() => onDelete(note.id, note.content)}>Delete</button>
    </li>
  )
}

export default Note