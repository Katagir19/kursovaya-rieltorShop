import { useMemo } from 'react';
import { useApartaments } from './useApartaments/useApartaments';
import { useTenants } from './useTenant/useTenants'; // проверьте правильность пути к хуку

export interface Payment {
  id: number;               // ID квартиры/платежа
  apartment_id: number;
  apartment_title: string;
  address: string;
  price: number;
  tenant_id: string | number;
  tenant_name: string;
  tenant_phone: string;
  tenant_email: string;
  created_at: string;       // Дата заселения / создания
  due_date: string;         // Срок истечения платежа (создание + 1 месяц)
}

export const usePayments = () => {
  const { apartaments, isLoading: isApartmentsLoading, error: apartmentsError } = useApartaments();
  const { tenants, isLoading: isTenantsLoading, error: tenantsError } = useTenants();

  const isLoading = isApartmentsLoading || isTenantsLoading;
  const error = apartmentsError || tenantsError;

  const payments = useMemo<Payment[]>(() => {
    if (!apartaments.length || !tenants.length) return [];

    // Фильтруем только те квартиры, у которых привязан tenant_id (заселенные)
    return apartaments
      .filter((apartment) => apartment.tenant_id && String(apartment.tenant_id).trim() !== '')
      .map((apartment) => {
        // Находим соответствующего жильца по ID
        const tenant = tenants.find(
          (t) => String(t.id) === String(apartment.tenant_id)
        );

        // Расчет даты истечения платежа (+1 месяц к дате создания/заселения)
        const startDate = apartment.created_at ? new Date(apartment.created_at) : new Date();
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + 1);

        return {
          id: apartment.id,
          apartment_id: apartment.id,
          apartment_title: apartment.title || 'Квартира',
          address: apartment.address || 'Адрес не указан',
          price: Number(apartment.price || 0),
          tenant_id: apartment.tenant_id,
          tenant_name: tenant?.full_name || 'Неизвестный жилец',
          tenant_phone: tenant?.phone || 'Не указан',
          tenant_email: tenant?.email || 'Не указан',
          created_at: startDate.toISOString(),
          due_date: dueDate.toISOString(),
        };
      });
  }, [apartaments, tenants]);

  return { payments, isLoading, error };
};
