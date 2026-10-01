export interface Tenant {
  id: number;
  full_name: string;
  email: string;
  budget: number;
  move_in_date: string;
  notes: string;
  phone: string;
  property_type: string;
  created_at: string;
  status: string;
}

export type CreateTenantInput = Omit<Tenant, 'id' | 'created_at'>;
