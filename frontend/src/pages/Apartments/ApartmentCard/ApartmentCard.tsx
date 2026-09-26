import type { Apartaments } from '../../../shared/modules/useApartaments/useApartaments';
import { IconBuilding, IconWallet, IconCalendar, IconUsers } from '../../../icons';
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
  DeleteBtn,
} from './style';

const STATUS_TONE: Record<string, 'good' | 'warn' | 'neutral'> = {
  'Свободна': 'good',
  'Занята': 'warn',
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('ru-RU');
};

interface ApartmentCardProps {
  apartment: Apartaments;
  onDelete: (id: number) => void;
}

export const ApartmentCard = ({ apartment, onDelete }: ApartmentCardProps) => {
  const tone = STATUS_TONE[apartment.status] ?? 'neutral';

  // Безопасное приведение цены к числу
  const safePrice = Number(apartment?.price) || 0;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Вы уверены, что хотите удалить квартиру "${apartment.title || apartment.address}"?`)) {
      onDelete(apartment.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Name>{apartment.title || 'Квартира'}</Name>
        <StatusBadge tone={tone}>{apartment.status}</StatusBadge>
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
          <IconSlot><IconBuilding /></IconSlot>
          <InfoText>{apartment.address}</InfoText>
        </InfoRow>
        <InfoRow>
          <IconSlot><IconBuilding /></IconSlot>
          <InfoText>{apartment.rooms}</InfoText>
        </InfoRow>
        <InfoRow>
          <IconSlot><IconWallet /></IconSlot>
          <InfoText mono>{safePrice.toLocaleString('ru-RU')} ₽ / мес.</InfoText>
        </InfoRow>
        {apartment.tenant_id && (
          <InfoRow>
            <IconSlot><IconUsers /></IconSlot>
            <InfoText>Арендатор (ID): {apartment.tenant_id}</InfoText>
          </InfoRow>
        )}
        {apartment.created_at && (
          <InfoRow>
            <IconSlot><IconCalendar /></IconSlot>
            <InfoText mono>{formatDate(apartment.created_at)}</InfoText>
          </InfoRow>
        )}
      </InfoGrid>
    </Card>
  );
};
