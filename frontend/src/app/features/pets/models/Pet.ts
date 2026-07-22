export interface Pet {
  petName: string;
  petId: number;
  owner_id: number;
  birthdate: string;
  age: number;
  sex: string;
  color: string | null;
  microchip_no: string | null;
  weight: string;
  pet_type_id: string;
  breed_id: string | null;
}

export interface PetApi {
  pet_id: number;
  pet_name: string;
  sex: string | null;
  weight: string | null;
  birthdate: string;
  owner_id: number;
  color: string | null;
  microchip_no: string | null;
  pet_type_id: string;
  breed_id: string | null;
}