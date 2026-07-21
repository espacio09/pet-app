export interface Pet {
  petName: string;
  petId: number;
  owner_id: number;
  birthdate: string;
  sex: string;
  color: string | null;
  microchip_no: string | null;
  weight: string;
  pet_type_id: string;
  breed_id: string | null;
}