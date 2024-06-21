const Note = ({ note, toggleImportance, onDelete }) => {
  const label = note.important ? 'make not important' : 'make important'

  return (
    <li className='note' data-testid="custom-element">
      <span>{note.content}</span>
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={() => onDelete(note.id, note.content)}>Delete</button>
    </li>
  )
}

export default Note