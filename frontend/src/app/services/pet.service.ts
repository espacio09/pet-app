import { PetDto } from "../../app/models/pet.dto";
import { mapPetsFromApi, type PetApi } from "../mappers/pet.mapper";


// ⚠️ Ajusta la URL a tu backend real
const API_URL = "http://localhost:3002/pets";

export class PetService {

  // ✅ Obtener todas las mascotas ya mapeadas
  static async getPets(): Promise<PetDto[]> {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Error al obtener mascotas");
      }

      const data: PetApi[] = await response.json();
      
    // ✅ 👇 AQUÍ va el console.log
    console.log("API DATA:", data);


      // ✅ Aquí ocurre la magia: API → DTO
      return mapPetsFromApi(data);

    } catch (error) {
      console.error("PetService.getPets error:", error);
      return []; // fallback seguro
    }
  }

  // ✅ Crear mascota (opcional)
  static async createPet(pet: PetDto): Promise<PetDto | null> {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...pet,
          // convertimos Date → string antes de enviar
          birthDate: pet.birthDate
            ? pet.birthDate.toISOString().split("T")[0]
            : null
        })
      });

      if (!response.ok) {
        throw new Error("Error al crear mascota");
      }

      const data: PetApi = await response.json();

      return mapPetsFromApi([data])[0];

    } catch (error) {
      console.error("PetService.createPet error:", error);
      return null;
    }
  }
}