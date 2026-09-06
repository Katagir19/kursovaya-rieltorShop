import { useTenants } from '../../shared/modules/useTenant/useTenants';
import { TenantCard } from './TenantCard/TenantCard';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IconUsers } from '../../icons';
import { Wrapper, List } from './style';

export const Tenants = () => {
  const { tenants, isLoading, error } = useTenants();

  if (isLoading) return <Wrapper>Загрузка...</Wrapper>;
  if (error) return <Wrapper>Ошибка: {error}</Wrapper>;

  if (tenants.length === 0) {
    return (
      <Wrapper>
        <EmptyState
          icon={<IconUsers />}
          title="Жильцов пока нет"
          description="Как только появятся арендаторы, здесь будет список карточек с их данными."
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <List>
        {tenants.map((tenant) => (
          <TenantCard key={tenant.id} tenant={tenant} />
        ))}
      </List>
    </Wrapper>
  );
};
