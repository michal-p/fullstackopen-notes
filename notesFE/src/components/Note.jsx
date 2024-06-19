const Note = ({ note, toggleImportance, onDelete }) => {
  const label = note.important ? 'not important' : 'important'

  return (
    <li className='note' data-testid="custom-element">
      Your awesome note: {note.content}
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={() => onDelete(note.id, note.content)}>Delete</button>
    </li>
  )
}

export default Note