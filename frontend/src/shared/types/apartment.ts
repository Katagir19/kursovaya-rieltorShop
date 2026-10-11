export interface Apartaments {
  title: string;
  id: number;
  address: string;
  rooms: string;
  price: number;
  status: string;
  tenant_id: string;
  created_at: string;
}

export type CreateApartamentsInput = Omit<Apartaments, 'id' | 'created_at'>;
