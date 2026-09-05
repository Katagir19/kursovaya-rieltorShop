import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IconBuilding } from '../../icons';
import { Wrapper } from './style';

export const Apartments = () => {
  return (
    <Wrapper>
      <EmptyState
        icon={<IconBuilding />}
        title="Квартир пока нет"
        description="Здесь будет список объектов в управлении: адрес, площадь, статус (свободна / сдана) и текущий жилец."
      />
    </Wrapper>
  );
};
