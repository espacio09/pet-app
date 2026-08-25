export interface Owner {
  ownerId: number;
   first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface OwnerApi {
  owner_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface CreateOwnerRequest {
  owner_id: number;
   first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface UpdateOwnerRequest {
  owner_id: number;
   first_name: string;
  last_name: string;
  email: string;
  phone: string;
}
 