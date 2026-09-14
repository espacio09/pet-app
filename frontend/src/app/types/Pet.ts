export interface Pet {
  petName: string;
  petId: number;
  ownerId: number;
  ownerFirstName?: string;
  ownerLastName?: string;
  ownerName?: string;
  ownerBirthdate?: Date | string;

  birthdate: Date;
  age: number;
  sex: string | null;
  color: string;
  microchip_no: number;
  weight: number;
  pet_typeId: number,
  breed_id: number;
  breedName?: string;
  breed_name?: string;
}

export interface PetApi {
  pet_id: number;
  pet_name: string;
  sex: string | null;
  weight: number;
  birthdate: Date | string;
  owner_id?: number;
  ownerId?: number;
  ownerFirstName?: string;
  ownerLastName?: string;
  owner_name?: string;
  owner_birthdate?: Date | string;
  color: string;
  microchip_no?: number;
  breed_id: number;
  breed_name?: string;

  pet_typeId: number;
}

export interface CreatePetRequest {
  pet_name: string;
  sex: string;
  weight: number;
  birthdate: Date;
  ownerId: number;
    ownerFirstName?: string;
  ownerLastName?: string;
  color: string;
    microchip_no?: number;
  pet_typeId: number;
  breed_id: number,
  breed_name?: string;
}

export interface UpdatePetRequest {
  pet_name?: string;
  color?: string;
  sex?: string;
  weight?: number;
  birthdate?: Date;
  owner_id?: number;
  ownerId?: number;
  ownerFirstName?: string;
  ownerLastName?: string;
  microchip_no?: number;
  owner_name?: string;
  owner_birthdate?: Date;
  pet_typeId?: number;
  breed_id?: number;
  breed_name?: string;
  
}
