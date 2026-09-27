import { ToggleContainer, ToggleItem } from './style';

interface PaymentStatusToggleProps {
  isPaid: boolean;
  onToggle: (isPaid: boolean) => void;
}

export const PaymentStatusToggle = ({ isPaid, onToggle }: PaymentStatusToggleProps) => {
  return (
    <ToggleContainer isPaid={isPaid} onClick={() => onToggle(!isPaid)}>
      <ToggleItem
        type="button"
        active={!isPaid}
        variant="unpaid"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(false);
        }}
      >
        Не оплачено
      </ToggleItem>
      <ToggleItem
        type="button"
        active={isPaid}
        variant="paid"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(true);
        }}
      >
        Оплачено
      </ToggleItem>
    </ToggleContainer>
  );
};
