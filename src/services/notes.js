import axios from 'axios' 
// Importa Axios, una biblioteca para realizar solicitudes HTTP.

const baseUrl = 'http://localhost:3001/api/notes' 
// Define la URL base del servidor para las operaciones relacionadas con las notas.

const getAll = () => {
  const request = axios.get(baseUrl) 
  // Realiza una solicitud HTTP GET al servidor para obtener todas las notas.
  return request.then(response => response.data) 
  // Devuelve una promesa que resuelve con los datos (`response.data`) de la respuesta.
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject) 
  // Realiza una solicitud HTTP POST al servidor para agregar un nuevo objeto (nota).
  return request.then(response => response.data) 
  // Devuelve una promesa que resuelve con los datos (`response.data`) de la respuesta.
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject) 
  // Realiza una solicitud HTTP PUT para actualizar una nota existente.
  // La URL incluye el `id` de la nota que se desea actualizar.
  return request.then(response => response.data) 
  // Devuelve una promesa que resuelve con los datos (`response.data`) de la respuesta.
}

export default { 
    // El nombre de la izquierda son las claves y la derecha son las variables
    // Ya que ambas tienen  los mismos nombre podemos simplificar
  /*getAll: getAll, 
  create: create, 
  update: update */
  getAll,
  create,
  update
} 
// Exporta los métodos `getAll`, `create` y `update` como un objeto para que puedan usarse en otras partes de la aplicación.
