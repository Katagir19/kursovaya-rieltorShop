import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IconReceipt } from '../../icons';
import { Wrapper } from './style';

export const Payments = () => {
  return (
    <Wrapper>
      <EmptyState
        icon={<IconReceipt />}
        title="Платежей пока нет"
        description="Здесь будет история начислений и оплат по каждому жильцу — с датой, суммой и статусом (оплачено, ожидается, просрочено)."
      />
    </Wrapper>
  );
};
