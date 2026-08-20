export interface Owner {
  ownerId: number;
  ownerName: string;
  email: string;
  phone: string;
}

export interface OwnerApi {
  owner_id: number;
  owner_name: string;
  email: string;
  phone: string;
}

export interface CreateOwnerRequest {
  ownerName: string;
  email: string;
  phone: string;
}

export interface UpdateOwnerRequest {
  ownerName?: string;
  email?: string;
  phone?: string;
}
 