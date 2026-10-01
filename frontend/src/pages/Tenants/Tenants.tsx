import { useState, useMemo } from 'react';
import { useTenants } from '../../shared/hooks/useTenants/useTenants';
import { TenantCard } from './TenantCard/TenantCard';
import { AddTenantModal } from './addTenantModal/addTenantModal';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { FilterBar, StatusOption } from '../../components/FilterBar';
import { IconUsers } from '../../shared/icons/icons';
import { Wrapper, List, HeaderBar, Title, AddButton } from './style';

const TENANT_STATUS_OPTIONS: StatusOption[] = [
  { label: 'Все статусы', value: 'all' },
  { label: 'Заселен', value: 'Заселен' },
  { label: 'В поиске', value: 'В поиске' },
];

export const Tenants = () => {
  const { tenants, isLoading, error, addTenant, deleteTenant } = useTenants();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        tenant.full_name?.toLowerCase().includes(query) ||
        tenant.phone?.toLowerCase().includes(query) ||
        tenant.email?.toLowerCase().includes(query) ||
        tenant.property_type?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' || tenant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tenants, searchQuery, statusFilter]);

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

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Поиск по ФИО, телефону, email..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={TENANT_STATUS_OPTIONS}
      />

      {filteredTenants.length === 0 ? (
        <EmptyState
          icon={<IconUsers />}
          title={tenants.length === 0 ? "Жильцов пока нет" : "Ничего не найдено"}
          description={
            tenants.length === 0
              ? "Как только появятся арендаторы, здесь будет список карточек с их данными."
              : "Попробуйте изменить запрос поиска или выбранный статус."
          }
        />
      ) : (
        <List>
          {filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              onDelete={deleteTenant}
            />
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
