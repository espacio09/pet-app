export interface Owner {
  ownerId: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  email: string;
  phone: string;
}

export interface OwnerApi {
  owner_id?: number;
  ownerId?: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  email: string;
  phone?: string;
}

export interface CreateOwnerRequest {
  ownerId: number;
  first_name?: string;
  last_name?: string;
  address?: string;
  email: string;
  phone: string;
}

export interface UpdateOwnerRequest {
  ownerId: number;
    first_name?: string;
  last_name?: string;
  address?: string;
  email: string;
  phone: string;
}
 