import { useState } from 'react';
import { useApartaments } from '../../shared/modules/useApartaments/useApartaments';
import { ApartmentCard } from './ApartmentCard/ApartmentCard';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IconBuilding } from '../../icons';
import { Wrapper, List, HeaderBar, Title, AddButton } from './style';
import { AddApartmentModal } from '../../shared/modules/addApartmentModal/addApartmentModal';

export const Apartments = () => {
  const { apartaments, isLoading, error, addApartament, deleteApartament } = useApartaments();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      {apartaments.length === 0 ? (
        <EmptyState
          icon={<IconBuilding />}
          title="Квартир пока нет"
          description="Здесь будет список объектов в управлении: адрес, стоимость, статус (свободна / занята) и текущий жилец."
        />
      ) : (
        <List>
          {apartaments.map((apartment) => (
            <ApartmentCard 
              key={apartment.id} 
              apartment={apartment}
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
