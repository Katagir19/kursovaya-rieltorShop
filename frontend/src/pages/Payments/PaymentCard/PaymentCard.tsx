import type { Payment } from '../../../shared/modules/usePayments';
import { IconPhone, IconMail, IconWallet, IconCalendar, IconBuilding } from '../../../icons';
import {
  Card,
  CardHeader,
  Name,
  Divider,
  InfoGrid,
  InfoRow,
  IconSlot,
  InfoText,
} from './style';

const formatDate = (iso: string) => {
  if (!iso) return 'Не указана';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('ru-RU');
};

interface PaymentCardProps {
  payment: Payment;
}

export const PaymentCard = ({ payment }: PaymentCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <Name>{payment.tenant_name}</Name>
          <InfoText style={{ fontSize: '12px', color: '#6b7280' }}>
            {payment.apartment_title} ({payment.address})
          </InfoText>
        </div>
      </CardHeader>

      <Divider />

      <InfoGrid>
        <InfoRow>
          <IconSlot><IconPhone /></IconSlot>
          <InfoText mono>{payment.tenant_phone}</InfoText>
        </InfoRow>

        <InfoRow>
          <IconSlot><IconMail /></IconSlot>
          <InfoText>{payment.tenant_email}</InfoText>
        </InfoRow>

        <InfoRow>
          <IconSlot><IconWallet /></IconSlot>
          <InfoText mono>{payment.price.toLocaleString('ru-RU')} ₽ / мес.</InfoText>
        </InfoRow>

        <InfoRow>
          <IconSlot><IconBuilding /></IconSlot>
          <InfoText>ID жильца: {payment.tenant_id}</InfoText>
        </InfoRow>

        <InfoRow>
          <IconSlot><IconCalendar /></IconSlot>
          <InfoText mono>
            Дата: {formatDate(payment.created_at)}
          </InfoText>
        </InfoRow>

        <InfoRow>
          <IconSlot><IconCalendar /></IconSlot>
          <InfoText mono style={{ color: '#e53e3e', fontWeight: 600 }}>
            Оплатить до: {formatDate(payment.due_date)}
          </InfoText>
        </InfoRow>
      </InfoGrid>
    </Card>
  );
};