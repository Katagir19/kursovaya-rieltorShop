import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IconGrid } from '../../icons';
import { Wrapper } from './style';

export const Dashboard = () => {
  return (
    <Wrapper>
      <EmptyState
        icon={<IconGrid />}
        title="Сводка пока пуста"
        description="Здесь появится общая картина: количество объектов в управлении, свободные квартиры и ближайшие платежи."
      />
    </Wrapper>
  );
};
