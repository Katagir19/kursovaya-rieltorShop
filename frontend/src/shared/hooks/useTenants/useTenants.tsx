import { useEffect, useState } from 'react';
import { tenantsService } from '../../services/tenantsService';
import type { CreateTenantInput, Tenant } from '../../types/tenant';

export type { CreateTenantInput, Tenant } from '../../types/tenant';

const getMessage = (err: unknown) => (err instanceof Error ? err.message : 'Неизвестная ошибка');

export const useTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    tenantsService
      .getAll()
      .then((data) => {
        if (!isCancelled) setTenants(data);
      })
      .catch((err) => {
        if (!isCancelled) setError(getMessage(err));
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const addTenant = async (tenantData: CreateTenantInput) => {
    try {
      const { id } = await tenantsService.create(tenantData);
      const newTenant: Tenant = {
        ...tenantData,
        id,
        budget: Number(tenantData.budget || 0),
        email: tenantData.email || '',
        move_in_date: tenantData.move_in_date || '',
        notes: tenantData.notes || '',
        phone: tenantData.phone || '',
        property_type: tenantData.property_type || '',
        status: tenantData.status || 'В поиске',
        created_at: new Date().toISOString(),
      };
      setTenants((prev) => [newTenant, ...prev]);
    } catch (err) {
      setError(getMessage(err));
      throw err;
    }
  };

  const deleteTenant = async (id: number) => {
    try {
      await tenantsService.remove(id);
      setTenants((prev) => prev.filter((tenant) => tenant.id !== id));
    } catch (err) {
      setError(getMessage(err));
      throw err;
    }
  };

  return { tenants, isLoading, error, addTenant, deleteTenant };
};
