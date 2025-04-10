import { supabase } from "@/lib/supabase";
import { Note } from "./note";

// Función para obtener todas las notas desde Supabase
export const getNotes = async (): Promise<Note[]> => {
    const { data, error } = await supabase.from("notes").select("*");
    if (error) {
        console.error("Error obteniendo notas:", error.message);
        return [];
    }
    // Se mapean los datos para ajustarlos al tipo Note
    return data.map((note) => ({
        id: note.id,
        title: note.title,
        text: note.text,
        date: note.date, // Se asume que la fecha se retorna en formato ISO
    }));
};

// Función para guardar una nueva nota o actualizar una existente
export const saveNote = async (note: Note): Promise<Note | null> => {
    const { id, title, text, date } = note;
    let response;
    
    try {
        // Si el id es mayor a 0, se actualiza la nota; de lo contrario, se inserta una nueva
        if (id > 0) {
            const { data, error } = await supabase
                .from("notes")
                .update({ title, text, date })
                .eq("id", id)
                .select();
                
            if (error) throw error;
            return data && data.length > 0 ? data[0] : null;
        } else {
            const { data, error } = await supabase
                .from("notes")
                .insert([{ title, text, date }])
                .select();
                
            if (error) throw error;
            return data && data.length > 0 ? data[0] : null;
        }
    } catch (error: any) {
        console.error("Error guardando la nota:", error.message);
        return null;
    }
};

// Función para eliminar una nota
export const deleteNote = async (id: number): Promise<boolean> => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
        console.error("Error eliminando la nota:", error.message);
        return false;
    }
    return true;
};