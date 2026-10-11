import { useState, useMemo } from 'react';
import { useApartaments } from '../../shared/hooks/useApartaments/useApartaments';
import { ApartmentCard } from './ApartmentCard/ApartmentCard';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { FilterBar, StatusOption } from '../../components/FilterBar';
import { IconBuilding } from '../../shared/icons/icons';
import { Wrapper, List, HeaderBar, Title, AddButton } from './style';
import { AddApartmentModal } from './addApartmentModal/addApartmentModal';
import { useTenants } from '../../shared/hooks/useTenants/useTenants';

const APARTMENT_STATUS_OPTIONS: StatusOption[] = [
  { label: 'Все статусы', value: 'all' },
  { label: 'Свободна', value: 'Свободна' },
  { label: 'Занята', value: 'Занята' },
];

export const Apartments = () => {
  const { apartaments, isLoading, error, addApartament, deleteApartament } = useApartaments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tenants } = useTenants();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredApartments = useMemo(() => {
    return apartaments.filter((apartment) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        apartment.title?.toLowerCase().includes(query) ||
        apartment.address?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' || apartment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [apartaments, searchQuery, statusFilter]);

  const tenantNames = useMemo(() => {
    const map = new Map<string, string>();
    tenants.forEach((t) => map.set(String(t.id), t.full_name));
    return map;
  }, [tenants]);

  if (isLoading) return <Wrapper>Загрузка...</Wrapper>;
  if (error) return <Wrapper>Ошибка: {error}</Wrapper>;

  return (
    <Wrapper>
      <HeaderBar>
        <Title>Квартиры</Title>
        <AddButton onClick={() => setIsModalOpen(true)}>
          + Добавить квартиру
        </AddButton>
      </HeaderBar>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Поиск по названию или адресу..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={APARTMENT_STATUS_OPTIONS}
      />

      {filteredApartments.length === 0 ? (
        <EmptyState
          icon={<IconBuilding />}
          title={apartaments.length === 0 ? "Квартир пока нет" : "Ничего не найдено"}
          description={
            apartaments.length === 0
              ? "Здесь будет список объектов в управлении: адрес, стоимость, статус (свободна / занята) и текущий жилец."
              : "Попробуйте изменить параметры поиска или сбросить фильтр статуса."
          }
        />
      ) : (
        <List>
          {filteredApartments.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              tenantName={
                apartment.tenant_id ? tenantNames.get(String(apartment.tenant_id)) : undefined
              }
              onDelete={deleteApartament}
            />
          ))}
        </List>
      )}

      <AddApartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addApartament}
      />
    </Wrapper>
  );
};
