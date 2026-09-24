import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IconReceipt } from '../../icons';
import { usePayments } from '../../shared/modules/usePayments';
import { PaymentCard } from './PaymentCard/PaymentCard';
import { Wrapper, List, HeaderBar, Title } from './style';

export const Payments = () => {
  const { payments, isLoading, error } = usePayments();

  if (isLoading) return <Wrapper>Загрузка платежей...</Wrapper>;
  if (error) return <Wrapper>Ошибка загрузки: {error}</Wrapper>;

  return (
    <Wrapper>
      <HeaderBar>
        <Title>Платежи</Title>
      </HeaderBar>

      {payments.length === 0 ? (
        <EmptyState
          icon={<IconReceipt />}
          title="Активных платежей нет"
          description="Платежи отображаются автоматически для квартир, у которых есть привязанный жилец."
        />
      ) : (
        <List>
          {payments.map((payment) => (
            <PaymentCard 
              key={payment.id} 
              payment={payment} 
            />
          ))}
        </List>
      )}
    </Wrapper>
  );
};
