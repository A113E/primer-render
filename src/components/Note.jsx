// Definición del componente funcional `Note`
// Recibe dos props:
// - `note`: Un objeto que representa una nota (con propiedades como `content` e `important`).
// - `toggleImportance`: Una función que cambia la importancia de la nota cuando se hace clic en el botón.
const Note = ({ note, toggleImportance }) => {

    // Determina el texto del botón según el estado de `important` de la nota.
    // Si `note.important` es true, el botón mostrará "make not important".
    // Si es false, el botón mostrará "make important".
    const label = note.important
      ? 'make not important' // Texto del botón si la nota es importante.
      : 'make important';    // Texto del botón si la nota no es importante.

    // Renderiza el elemento del componente.
    // Devuelve un elemento `<li>` que contiene:
    // - El contenido de la nota (`note.content`).
    // - Un botón que, al hacer clic, llama a la función `toggleImportance`.
    return (
      <li className="note">
        {note.content} {/* Muestra el contenido de la nota. */}
        <button onClick={toggleImportance}>{label}</button> 
        {/* Botón para cambiar la importancia de la nota.
            Al hacer clic, ejecuta la función `toggleImportance`.
            El texto del botón está determinado por `label`. */}
      </li>
    );
};
export default Note