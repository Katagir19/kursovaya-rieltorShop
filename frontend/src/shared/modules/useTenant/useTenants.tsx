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
          budget: item.budget,
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

  return { tenants, isLoading, error };
};
