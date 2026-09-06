import type { Tenant } from '../../../shared/modules/useTenant/useTenants';
import { IconPhone, IconMail, IconWallet, IconCalendar, IconBuilding } from '../../../icons';
import {
  Card,
  CardHeader,
  Name,
  StatusBadge,
  Divider,
  InfoGrid,
  InfoRow,
  IconSlot,
  InfoText,
  Notes,
} from './style';

const STATUS_TONE: Record<string, 'good' | 'warn' | 'neutral'> = {
  'Заселен': 'good',
  'В поиске': 'warn',
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('ru-RU');
};

interface TenantCardProps {
  tenant: Tenant;
}

export const TenantCard = ({ tenant }: TenantCardProps) => {
  const tone = STATUS_TONE[tenant.status] ?? 'neutral';

  return (
    <Card>
      <CardHeader>
        <Name>{tenant.full_name}</Name>
        <StatusBadge tone={tone}>{tenant.status}</StatusBadge>
      </CardHeader>

      <Divider />

      <InfoGrid>
        <InfoRow>
          <IconSlot><IconPhone /></IconSlot>
          <InfoText mono>{tenant.phone}</InfoText>
        </InfoRow>
        <InfoRow>
          <IconSlot><IconMail /></IconSlot>
          <InfoText>{tenant.email}</InfoText>
        </InfoRow>
        <InfoRow>
          <IconSlot><IconWallet /></IconSlot>
          <InfoText mono>{tenant.budget.toLocaleString('ru-RU')} ₽</InfoText>
        </InfoRow>
        <InfoRow>
          <IconSlot><IconBuilding /></IconSlot>
          <InfoText>{tenant.property_type}</InfoText>
        </InfoRow>
        <InfoRow>
          <IconSlot><IconCalendar /></IconSlot>
          <InfoText mono>{formatDate(tenant.move_in_date)}</InfoText>
        </InfoRow>
      </InfoGrid>

      {tenant.notes && <Notes>«{tenant.notes}»</Notes>}
    </Card>
  );
};