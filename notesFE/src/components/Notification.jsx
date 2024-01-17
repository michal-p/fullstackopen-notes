const Notification = ({ message, typeMessage }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`notification ${typeMessage}`}>
      {message}
    </div>
  )
}

export default Notification