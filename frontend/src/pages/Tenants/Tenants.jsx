import { useState } from 'react';
import { useTenants } from '../../shared/modules/useTenant/useTenants';
import { TenantCard } from './TenantCard/TenantCard';
import { AddTenantModal } from '../../shared/modules/addTenantModal/addTenantModal';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IconUsers } from '../../icons';
import { Wrapper, List, HeaderBar, Title, AddButton } from './style';

export const Tenants = () => {
  const { tenants, isLoading, error, addTenant, deleteTenant } = useTenants();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <Wrapper>Загрузка...</Wrapper>;
  if (error) return <Wrapper>Ошибка: {error}</Wrapper>;

  return (
    <Wrapper>
      <HeaderBar>
        <Title>Жильцы</Title>
        <AddButton onClick={() => setIsModalOpen(true)}>
          + Добавить жильца
        </AddButton>
      </HeaderBar>

      {tenants.length === 0 ? (
        <EmptyState
          icon={<IconUsers />}
          title="Жильцов пока нет"
          description="Как только появятся арендаторы, здесь будет список карточек с их данными."
        />
      ) : (
        <List>
          {tenants.map((tenant) => (
            <TenantCard 
              key={tenant.id} 
              tenant={tenant}
              onDelete={deleteTenant} />
          ))}
        </List>
      )}

      <AddTenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTenant}
      />
    </Wrapper>
  );
};
