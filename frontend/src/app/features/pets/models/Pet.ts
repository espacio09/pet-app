export interface Pet {
  petName: string | null;
  petId: number | null;
  ownerId: number | null;
  birthdate: Date | null;
  age: number;
  sex: string | null;
  color: string;
  microchip_no: number | null;
  weight: number;
  pet_typeId: number | null;
  breed_id: number | null;
}

export interface PetApi {
  pet_id: number | null;
  pet_name: string | null;
  sex: string | null;
  weight: number;
  birthdate: Date | null;
  ownerId: number | null;
  color: string;
  microchip_no: number | null;
  pet_typId: number | null;
  breed_id: number | null;
}

export interface CreatePetRequest {
  pet_name: string | null;
  sex: string;
  weight: number;
  birthdate: Date | null;
  ownerId: number | null;
  color: string;
  microchip_no: number  | null;
  pet_typeId: number;
  breed_id: number | null;
}
