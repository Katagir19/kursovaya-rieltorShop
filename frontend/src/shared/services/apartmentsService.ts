import type { Apartaments, CreateApartamentsInput } from '../types/apartment';
import { apiRequest } from './apiClient';

interface ApartmentApi {
  id: number;
  title: string;
  address: string;
  rooms: string;
  price: number | string | null;
  status: string;
  tenant_id: number | null;
  created_at: string;
}

interface MutationResult {
  message: string;
  id: number;
}

const toApartament = (item: ApartmentApi): Apartaments => ({
  id: item.id,
  title: item.title,
  address: item.address,
  rooms: item.rooms,
  price: Number(item.price || 0),
  status: item.status,
  tenant_id: item.tenant_id ? String(item.tenant_id) : '',
  created_at: item.created_at,
});

export const apartmentsService = {
  async getAll(): Promise<Apartaments[]> {
    const data = await apiRequest<ApartmentApi[]>('/api/apartments');
    return data.map(toApartament);
  },

  create(input: CreateApartamentsInput) {
    // В форме tenant_id — строка из <select>, бэкенд ждёт число или null
    const payload = { ...input, tenant_id: input.tenant_id ? Number(input.tenant_id) : null };
    return apiRequest<MutationResult>('/api/apartments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  remove(id: number) {
    return apiRequest<MutationResult>(`/api/apartments/${id}`, { method: 'DELETE' });
  },
};
