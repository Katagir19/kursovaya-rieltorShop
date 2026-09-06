import { useState, useEffect } from 'react';

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

const API_URL = 'http://127.0.0.1:8000/api/tenants';

export const useTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchTenantInfo = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Error status: ${response.status}`);
        }
        const data = await response.json();

        const newTenants: Tenant[] = data.map((item: any) => ({
          id: item.id,
          full_name: item.full_name,
          email: item.email,
          budget: Number(item.budget || 0),
          move_in_date: item.move_in_date,
          notes: item.notes,
          phone: item.phone,
          property_type: item.property_type,
          created_at: item.created_at,
          status: item.status,
        }));

        if (!isCancelled) setTenants(newTenants);
      } catch (err: any) {
        if (!isCancelled) setError(err.message);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchTenantInfo();

    return () => {
      isCancelled = true;
    };
  }, []);

  const addTenant = async (tenantData: CreateTenantInput) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tenantData),
    });

    if (!response.ok) {
      throw new Error(`Не удалось добавить жильца (код ${response.status})`);
    }

    const resJson = await response.json();

    const newTenant: Tenant = {
      id: resJson.id,
      full_name: resJson.full_name || tenantData.full_name,
      email: resJson.email || tenantData.email || '',
      budget: Number(resJson.budget ?? tenantData.budget ?? 0),
      move_in_date: resJson.move_in_date || tenantData.move_in_date || '',
      notes: resJson.notes || tenantData.notes || '',
      phone: resJson.phone || tenantData.phone || '',
      property_type: resJson.property_type || tenantData.property_type || '',
      created_at: resJson.created_at || new Date().toISOString(),
      status: resJson.status || tenantData.status || 'В поиске',
    };

    setTenants((prev) => [newTenant, ...prev]);
  } catch (err: any) {
    console.error('Ошибка при добавлении:', err);
    setError(err.message);
    throw err;
  }
};

  const deleteTenant = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Ошибка удаления (код ${response.status})`);
      }

      setTenants((prev) => prev.filter((tenant) => tenant.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { tenants, isLoading, error, addTenant, deleteTenant };
};