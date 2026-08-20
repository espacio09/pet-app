export interface Pet {
  petName: string;
  petId: number;
  ownerId: number;
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
  pet_name: string;
  sex: string | null;
  weight: number;
  birthdate: Date;
  ownerId: number;
  color: string;
  microchip_no: number;
  breed_id: number
  pet_typeId: number
}

export interface CreatePetRequest {
  pet_name: string;
  sex: string;
  weight: number;
  birthdate: Date;
  ownerId: number;
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
