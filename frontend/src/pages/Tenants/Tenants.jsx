import { useTenants } from '../../shared/modules/useTenant/useTenants';
import { Wrapper } from './style';

export const Tenants = () => {
  const { tenants, isLoading, error } = useTenants();

  if (isLoading) return <Wrapper>Загрузка...</Wrapper>;
  if (error) return <Wrapper>Ошибка: {error}</Wrapper>;

  return (
    <Wrapper>
      {tenants.map((tenant) => (
        <div key={tenant.id}>
          <p>{tenant.full_name} — {tenant.status}</p>
          <p>{tenant.phone} · {tenant.email}</p>
          <p>{tenant.budget.toLocaleString('ru-RU')} ₽ · {tenant.property_type}</p>
        </div>
      ))}
    </Wrapper>
  );
};
