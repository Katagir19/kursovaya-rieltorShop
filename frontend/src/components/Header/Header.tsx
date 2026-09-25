import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bar, TitleBlock, Title, Subtitle, Profile, Avatar, ProfileName } from './style';

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Дашборд', subtitle: 'Общая сводка по объектам' },
  '/apartments': { title: 'Квартиры', subtitle: 'Все объекты в управлении' },
  '/tenants': { title: 'Жильцы', subtitle: 'Текущие и бывшие арендаторы' },
  '/payments': { title: 'Платежи', subtitle: 'История начислений и оплат' },
  '/settings': { title: 'Настройки', subtitle: 'Параметры аккаунта' },
};

export const Header = () => {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? { title: 'Риелтор CRM', subtitle: '' };
  
  const [userName, setUserName] = useState('Агент Иванов');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.full_name) setUserName(parsed.full_name);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Bar>
      <TitleBlock>
        <Title>{meta.title}</Title>
        {meta.subtitle && <Subtitle>{meta.subtitle}</Subtitle>}
      </TitleBlock>

      <Profile>
        <Avatar>{getInitials(userName)}</Avatar>
        <ProfileName>{userName}</ProfileName>
      </Profile>
    </Bar>
  );
};
