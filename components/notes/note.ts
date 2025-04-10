// Definición de la estructura de una nota en la aplicación
export type Note = {
    id: number;    // Identificador único de la nota
    title: string; // Título de la nota
    text: string;  // Contenido de la nota
    date: string;  // Fecha en formato ISO (cadena) para facilitar su manejo
};