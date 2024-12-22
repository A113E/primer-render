import { useState, useEffect } from 'react';  // Importa hooks de React para gestionar estados y efectos secundarios.
import axios from 'axios'; // Importa axios, una biblioteca para realizar solicitudes HTTP.
import Note from './components/Note' // Importa el componente Note desde la carpeta components.
import noteService from './services/notes' // Importa el módulo noteService
import './index.css' // Importa la hoja de estilos
import Notification from './components/Notification' // Importa el componente Notification
import Footer from './components/Footer' // Importa el componente Footer

//COMPONENTE PRINCIPAL
const App = () => {
  // Define un estado para almacenar las notas como un array vacío inicialmente.
  const [notes, setNotes] = useState(null) //notes Almacena una lista de notas.
  // Define un estado para almacenar el texto de una nueva nota que se está escribiendo.
  const [newNote, setNewNote] = useState('')//Almacena el valor del campo de entrada (input).
  // Define un estado booleano para controlar si se muestran todas las notas o solo las importantes.
  const [showAll, setShowAll] = useState(true) 
  const [errorMessage, setErrorMessage] = useState('some error happened...')


  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  
  
  

  useEffect(() => {
    // `useEffect` es un hook de React que se utiliza para ejecutar efectos secundarios en componentes funcionales.
    // En este caso, se usa para obtener las notas iniciales desde el servidor cuando el componente se monta.
  
    noteService
      .getAll() 
      // Llama a la función `getAll` del servicio `noteService`.
      // Esta función realiza una solicitud HTTP GET al servidor para recuperar todas las notas.
  
      .then(initialNotes => {
        // `then` es el método que se ejecuta una vez que la solicitud HTTP se completa con éxito.
        // Recibe los datos (`initialNotes`) que devolvió el servidor como respuesta.
  
        setNotes(initialNotes)
        // Actualiza el estado `notes` del componente con las notas iniciales obtenidas.
        // Esto hace que el componente se vuelva a renderizar con las notas recién cargadas.
      })
  }, [])
  // El segundo argumento de `useEffect` es un array de dependencias.
  // En este caso, está vacío `[]`, lo que significa que este efecto solo se ejecutará una vez,
  // cuando el componente se monte por primera vez.
 
 //  Estado notes si es nulo
  if (!notes) { 
    return null 
  }

  

console.log('render', notes.length, 'notes') // Muestra en consola el número de notas almacenadas. 

 //Controlador de eventos para editar las notas
   // Controlador para actualizar el estado de newNote al escribir en el input.
   const handleNoteChange = (event) =>{ 
    console.log(event.target.value) // Muestra en consola el valor actual del input.
    setNewNote(event.target.value) //La propiedad target del objeto de evento ahora corresponde al elemento input controlado y event.target.value se refiere al valor de entrada de ese elemento.
  }
  
  //Filtrar las notas más importantes (según el estado de showAll.)
  const notesToShow = showAll
  ? notes // Si showAll es true, muestra todas las notas.
  : notes.filter(note => note.important) // Si es false, muestra solo las importantes.
  
  
    // Controlador para agregar una nueva nota.
    const addNote = (event) => { //El formulario tiene un onSubmit={addNote}. Significa que cuando se envíe el formulario, se ejecutará la función addNote.
      event.preventDefault() //previene que la página se recargue al enviar el formulario.
      // Crea un nuevo objeto de nota.
      const noteObject = { //recibirá su contenido del estado del componente newNote
        content: newNote, // El contenido de la nota proviene del estado newNote.
        important: Math.random() < 0.5, //nuestra nota tiene un 50% de posibilidades de ser marcada como importante.
        id: notes.length +1, // Genera un id único basado en el número actual de notas.
      }

      
      noteService
      .create(noteObject)
      // Llama al método `create` del servicio `noteService` para enviar una nueva nota al servidor.
      // `create` recibe `noteObject`, que es el objeto que contiene los datos de la nueva nota.
    
      .then(returnedNote => {
        // `then` se ejecuta después de que la solicitud HTTP POST se completa exitosamente.
        // El argumento `returnedNote` es el objeto de la nueva nota, tal como lo devuelve el servidor.
    
        setNotes(notes.concat(returnedNote))
        // Actualiza el estado `notes` añadiendo la nueva nota (`returnedNote`) al array existente:
        // - `notes.concat(returnedNote)` crea un nuevo array que incluye todas las notas existentes más la nueva.
        // Esto asegura que el estado `notes` se actualice sin mutar directamente el array original.
    
        setNewNote('')
        // Limpia el campo de entrada de texto al restablecer el estado `newNote` a una cadena vacía.
        // Esto da retroalimentación visual al usuario, indicando que la nota fue añadida correctamente.
      })
    
    
    }

  return (
    <div>
   <h1>Notes</h1> {/* Título de la sección de notas. */}
   <Notification message={errorMessage} />
    <div>
      {/* Botón para alternar entre mostrar todas las notas o solo las importantes. */}
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' } 
        </button>
      </div>
    <ul>
      {/* Mapea las notas filtradas para renderizar un componente Note por cada una. */}
      
{notesToShow.map((note, i) => 
  <Note
    key={i} // Asigna una clave única para cada elemento renderizado en la lista. Aquí usa el índice `i` como clave (aunque idealmente debería ser un identificador único como `note.id`).
    note={note} // Pasa la nota actual como prop `note` al componente `Note`.
    toggleImportance={() => toggleImportanceOf(note.id)} // Pasa una función como prop `toggleImportance`.
  />
)}

    </ul>
    <form onSubmit={addNote}> {/* Formulario para agregar una nueva nota. */}
      <input //La etiqueta <input> tiene el valor de newNote.
        value={newNote} // Vincula el valor del input con el estado newNote.
        onChange={handleNoteChange} // Controlador para manejar cambios en el input.
      />
      <button type="submit">save</button> {/* Botón para enviar el formulario. */}
    </form> 
    <Footer/>  
  </div>
)
}



export default App
