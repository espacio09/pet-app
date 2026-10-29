export interface Vet {
  vetId: number;
  id?: number;
  name?: string;
  specialty?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
}

export interface VetApi {
  id?: number;
  vetId?: number;
  name?: string;
  specialty?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
}

export interface CreateVetRequest {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export type UpdateVetRequest = Partial<CreateVetRequest>;
