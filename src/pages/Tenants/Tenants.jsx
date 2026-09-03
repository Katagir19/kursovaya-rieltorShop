import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IconUsers } from '../../icons';
import { Wrapper } from './style';

export const Tenants = () => {
  return (
    <Wrapper>
      <EmptyState
        icon={<IconUsers />}
        title="Жильцов пока нет"
        description="Здесь появится список арендаторов: контакты, договор, срок аренды и квартира, которую они снимают."
      />
    </Wrapper>
  );
};
