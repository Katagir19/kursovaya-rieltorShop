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
  DeleteBtn,
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
  onDelete: (id: number) => void;
}

export const TenantCard = ({ tenant, onDelete }: TenantCardProps) => {
  const tone = STATUS_TONE[tenant.status] ?? 'neutral';

  // Безопасное приведение бюджета к числу
  const safeBudget = Number(tenant?.budget) || 0;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Вы уверены, что хотите удалить жильца ${tenant.full_name}?`)) {
      onDelete(tenant.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Name>{tenant.full_name}</Name>
        <StatusBadge tone={tone}>{tenant.status}</StatusBadge>
        <DeleteBtn aria-label="Удалить" onClick={handleDeleteClick}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </DeleteBtn>
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
          <InfoText mono>{safeBudget.toLocaleString('ru-RU')} ₽</InfoText>
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