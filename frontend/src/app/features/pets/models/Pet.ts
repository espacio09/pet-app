export interface Pet {
  petName: string | null;
  petId: number;
  ownerId: number | null;
  birthdate: Date;
  age: number;
  sex: string | null;
  color: string;
  microchip_no: number;
  weight: number;
  pet_typeId: number | null;
  breed_id: number | null;
}

export interface PetApi {
  pet_id: number;
  pet_name: string | null;
  sex: string | null;
  weight: number;
  birthdate: Date;
  ownerId: number | null;
  color: string;
  microchip_no: number;
  breed_id: number | null;
}

export interface CreatePetRequest {
  pet_name: string | null;
  sex: string;
  weight: number;
  birthdate: Date;
  ownerId: number | null;
  color: string;
  microchip_no: number;
  pet_typeId: number;
  breed_id: number | null;
}

export interface UpdatePetRequest {
  pet_name?: string;
  color?: string;
  sex?: string;
  weight?: number;
  birthdate?: Date;
  ownerId?: number;
  microchip_no?: number;
  pet_typeId?: number;
  breed_id?: number;
}
