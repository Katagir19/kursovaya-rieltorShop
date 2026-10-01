import type { CreateTenantInput, Tenant } from '../types/tenant';
import { apiRequest } from './apiClient';

// То, что реально приходит с бэкенда (MySQL может вернуть null и Decimal-строки)
interface TenantApi {
  id: number;
  full_name: string;
  email: string | null;
  budget: number | string | null;
  move_in_date: string | null;
  notes: string | null;
  phone: string | null;
  property_type: string | null;
  created_at: string;
  status: string | null;
}

interface MutationResult {
  message: string;
  id: number;
}

const toTenant = (item: TenantApi): Tenant => ({
  id: item.id,
  full_name: item.full_name,
  email: item.email ?? '',
  budget: Number(item.budget || 0),
  move_in_date: item.move_in_date ?? '',
  notes: item.notes ?? '',
  phone: item.phone ?? '',
  property_type: item.property_type ?? '',
  created_at: item.created_at,
  status: item.status ?? '',
});

export const tenantsService = {
  async getAll(): Promise<Tenant[]> {
    const data = await apiRequest<TenantApi[]>('/api/tenants');
    return data.map(toTenant);
  },

  create(input: CreateTenantInput) {
    return apiRequest<MutationResult>('/api/tenants', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  remove(id: number) {
    return apiRequest<MutationResult>(`/api/tenants/${id}`, { method: 'DELETE' });
  },
};
