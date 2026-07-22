import type { Pet } from "../models/Pet";

const API_URL = "http://localhost:3002/pets"; // ajusta tu backend

export const petService = {
  getAll: async (): Promise<Pet[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al obtener mascotas");
    }

    return response.json();
  },
};