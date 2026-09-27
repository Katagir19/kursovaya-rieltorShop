import React, { useState } from 'react';
import { PaymentStatusToggle } from '../PaymentStatusToggle/PaymentStatusToggle';
import {
  AmountBox,
  Row,
  InputWrapper,
  Input,
  Symbol,
  AddButton,
  StatusMessage,
  ResetLink,
} from './style';

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
  // Значение, которое юзер печатает прямо сейчас в инпуте
  const [inputValue, setInputValue] = useState<string>('');

  const remaining = Math.max(0, totalPrice - paidAmount);
  const isFullyPaid = paidAmount >= totalPrice;

  // Обработка переключателя Оплачено / Не оплачено
  const handleToggle = (isPaid: boolean) => {
    if (isPaid) {
      onChangePaidAmount(totalPrice);
    } else {
      onChangePaidAmount(0);
    }
    setInputValue('');
  };

  // Логика внесения суммы по Enter или кнопке
  const handleAddPayment = () => {
    const val = Number(inputValue);
    if (Number.isNaN(val) || val <= 0) return;

    // Прибавляем введенную сумму к уже внесенной (не превышая общую цену)
    const updatedPaid = Math.min(totalPrice, paidAmount + val);
    onChangePaidAmount(updatedPaid);
    setInputValue(''); // Очищаем инпут после внесения
  };

  // Слушаем нажатие Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPayment();
    }
  };

  return (
    <AmountBox>
      <Row>
        <PaymentStatusToggle isPaid={isFullyPaid} onToggle={handleToggle} />

        <InputWrapper>
          <Input
            type="number"
            placeholder="Внести..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            min={1}
            max={remaining}
          />
          <Symbol>₽</Symbol>
          <AddButton
            type="button"
            onClick={handleAddPayment}
            disabled={!inputValue || Number(inputValue) <= 0}
            title="Нажмите Enter для внесения платежа"
          >
            ↵
          </AddButton>
        </InputWrapper>
      </Row>

      {/* Вывод информационного блока */}
      {isFullyPaid ? (
        <StatusMessage type="success">
          <span>✓ Оплачено полностью ({totalPrice.toLocaleString('ru-RU')} ₽)</span>
          <ResetLink onClick={() => onChangePaidAmount(0)}>Сбросить</ResetLink>
        </StatusMessage>
      ) : remaining > 0 && paidAmount > 0 ? (
        <StatusMessage type="warning">
          <span>Внесено: {paidAmount.toLocaleString('ru-RU')} ₽</span>
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
