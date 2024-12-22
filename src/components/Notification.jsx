const Notification = ({ message }) => {
  if (!message) {
    return null; // No renderiza nada si no hay mensaje
  }

  return (
    <div className="error">
      {message}
    </div>
  );
};

export default Notification;