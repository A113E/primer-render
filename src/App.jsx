import { useState, useEffect } from 'react';  // Importa hooks de React para gestionar estados y efectos secundarios.
import axios from 'axios'; // Importa axios, una biblioteca para realizar solicitudes HTTP.
import Note from './components/Note'; // Importa el componente Note desde la carpeta components.
import noteService from './services/notes'; // Importa el módulo noteService
import './index.css'; // Importa la hoja de estilos
import Notification from './components/Notification'; // Importa el componente Notification
import Footer from './components/Footer'; // Importa el componente Footer

//COMPONENTE PRINCIPAL
const App = () => {
  // Define un estado para almacenar las notas como un array vacío inicialmente.
  const [notes, setNotes] = useState([]); // notes Almacena una lista de notas.
  // Define un estado para almacenar el texto de una nueva nota que se está escribiendo.
  const [newNote, setNewNote] = useState(''); // Almacena el valor del campo de entrada (input).
  // Define un estado booleano para controlar si se muestran todas las notas o solo las importantes.
  const [showAll, setShowAll] = useState(true); 
  const [errorMessage, setErrorMessage] = useState(null);

  // Función para alternar la importancia de una nota.
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    // Corrección: pasa id y changedNote correctamente.
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote)); // Actualiza la lista de notas con la nota modificada.
      })
      .catch(error => {
        setErrorMessage(`Note '${note.content}' was already removed from server`); // Error si la nota ya fue eliminada.
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter(n => n.id !== id)); // Elimina la nota del estado si no se encuentra en el servidor.
      });
  };

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        if (Array.isArray(initialNotes)) {
          setNotes(initialNotes); // Solo establece las notas si es un array
        } else {
          console.error('El backend devolvió un formato no válido:', initialNotes);
          setNotes([]); // Establece un array vacío si el formato no es válido
        }
      })
      .catch(error => {
        setErrorMessage('Failed to load notes');
        console.error('Error al cargar las notas:', error);
        setTimeout(() => setErrorMessage(null), 5000);
      });
  }, []);

  console.log('render', notes.length, 'notes'); // Muestra en consola el número de notas almacenadas. 

  // Controlador de eventos para editar las notas.
  const handleNoteChange = (event) =>{ 
    console.log(event.target.value); // Muestra en consola el valor actual del input.
    setNewNote(event.target.value); // Actualiza el estado con el nuevo valor del input.
  };
  
  // Filtrar las notas más importantes (según el estado de showAll.)
  const notesToShow = showAll
    ? notes // Si showAll es true, muestra todas las notas.
    : notes.filter(note => note.important); // Si es false, muestra solo las importantes.
  
  // Controlador para agregar una nueva nota.
  const addNote = (event) => {
    event.preventDefault(); // Previene que la página se recargue al enviar el formulario.

    // Crea un nuevo objeto de nota.
    const noteObject = {
      content: newNote, // El contenido de la nota proviene del estado newNote.
      important: Math.random() < 0.5, // La nota tiene un 50% de probabilidades de ser marcada como importante.
      id: notes.length + 1, // Genera un id único basado en el número actual de notas.
    };

    noteService
      .create(noteObject) // Envia la nueva nota al servidor.
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote)); // Actualiza el estado `notes` añadiendo la nueva nota.
        setNewNote(''); // Limpia el campo de entrada de texto.
      })
      .catch(error => {
        setErrorMessage('Failed to add note'); // Muestra un error si no se puede agregar la nota.
        setTimeout(() => setErrorMessage(null), 5000);
      });
  };

  return (
    <div>
      <h1>Notes</h1> {/* Título de la sección de notas. */}
      <Notification message={errorMessage} /> {/* Muestra el mensaje de error si lo hay. */}

      <div>
        {/* Botón para alternar entre mostrar todas las notas o solo las importantes. */}
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {/* Mapea las notas filtradas para renderizar un componente Note por cada una. */}
        {notesToShow.map(note => (
          <Note
            key={note.id} // Usar note.id en lugar de i como clave.
            note={note} // Pasa la nota actual como prop `note` al componente `Note`.
            toggleImportance={() => toggleImportanceOf(note.id)} // Pasa una función como prop `toggleImportance`.
          />
        ))}
      </ul>

      <form onSubmit={addNote}> {/* Formulario para agregar una nueva nota. */}
        <input
          value={newNote} // Vincula el valor del input con el estado newNote.
          onChange={handleNoteChange} // Controlador para manejar cambios en el input.
        />
        <button type="submit">save</button> {/* Botón para enviar el formulario. */}
      </form> 

      <Footer />  
    </div>
  );
};

export default App;
