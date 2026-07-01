import { PetDto } from "../models/pet.dto";

export type PetApi = {
  pet_id?: number;
  petId?: number;

  pet_name?: string;
  name?: string;
  petName?: string;

  pet_type_id?: number;
  petTypeId?: number;

  birthDate?: string | Date | null;
  birth_date?: string | Date | null;
};

export function mapPetFromApi(raw: PetApi, index: number): PetDto {

  // ✅ definir variable aquí (ANTES del return)
  const dateValue =
  raw.birthDate ??
  raw.birth_date ??
  raw.birthdate;

  return {
    petId: raw.pet_id ?? raw.petId ?? index,
    petName: raw.pet_name ?? raw.petName ?? raw.name ?? "No name",
    petTypeId: raw.pet_type_id ?? raw.petTypeId ?? 0,

    // ✅ usar variable aquí
    birthDate: dateValue ? new Date(dateValue) : undefined
 
  };
}

export function mapPetsFromApi(rawPets: PetApi[]): PetDto[] {
  return rawPets.map((pet, index) => mapPetFromApi(pet, index));
}