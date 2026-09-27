import { PaymentStatusToggle } from '../PaymentStatusToggle/PaymentStatusToggle';
import { AmountBox, Row, InputWrapper, Input, Symbol, StatusMessage } from './style';

interface PaymentAmountInputProps {
  totalPrice: number;
  paidAmount: number;
  onChangePaidAmount: (amount: number) => void;
}

export const PaymentAmountInput = ({
  totalPrice,
  paidAmount,
  onChangePaidAmount,
}: PaymentAmountInputProps) => {
  const remaining = totalPrice - paidAmount;
  const isFullyPaid = paidAmount >= totalPrice;

  const handleToggle = (isPaid: boolean) => {
    onChangePaidAmount(isPaid ? totalPrice : 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (Number.isNaN(val)) return;
    onChangePaidAmount(val);
  };

  return (
    <AmountBox>
      <Row>
        <PaymentStatusToggle isPaid={isFullyPaid} onToggle={handleToggle} />

        <InputWrapper>
          <Input
            type="number"
            placeholder="0"
            value={paidAmount || ''}
            onChange={handleInputChange}
            min={0}
            max={totalPrice}
          />
          <Symbol>₽ внесено</Symbol>
        </InputWrapper>
      </Row>

      {/* Вывод инфо-сообщения */}
      {isFullyPaid ? (
        <StatusMessage type="success">
          <span>✓ Оплачено полностью</span>
          <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
        </StatusMessage>
      ) : remaining > 0 && paidAmount > 0 ? (
        <StatusMessage type="warning">
          <span>Частичная оплата</span>
          <span>Осталось еще {remaining.toLocaleString('ru-RU')} ₽</span>
        </StatusMessage>
      ) : (
        <StatusMessage type="danger">
          <span>Не оплачено</span>
          <span>К оплате: {totalPrice.toLocaleString('ru-RU')} ₽</span>
        </StatusMessage>
      )}
    </AmountBox>
  );
};
