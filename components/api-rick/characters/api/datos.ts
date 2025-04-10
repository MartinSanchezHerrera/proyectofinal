//tipo de character donde especificacmos las propiedades de un personaje 
export type Character ={ 
id:number; 
name: string; 
status:"Alive" | "Dead" |"unknow"; 
origin: string; 
species: string; 
location: { 
name: string; 
}; 
image: string; 
} 
