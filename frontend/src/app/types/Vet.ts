export interface Vet {
  vetId: number;
  id?: number;
  name?: string;
  specialty?: string;
  specialization?: string | null;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  street?: string | null;
  houseNumber?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
  phoneCountryCode?: string | null;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  notes?: string | null;
}

export interface VetApi {
  id?: number;
  vetId?: number;
  name?: string;
  specialty?: string;
  specialization?: string | null;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  street?: string | null;
  houseNumber?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
  phoneCountryCode?: string | null;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  notes?: string | null;
}

export interface CreateVetRequest {
  firstName: string;
  lastName: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  country: string;
  email: string;
  phone: string;
  phoneCountryCode?: string;
  specialization?: string;
  notes?: string;
}

export type UpdateVetRequest = Partial<CreateVetRequest>;
