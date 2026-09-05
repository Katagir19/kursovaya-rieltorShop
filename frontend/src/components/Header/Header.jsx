import { useLocation } from 'react-router-dom';
import { Bar, TitleBlock, Title, Subtitle, Profile, Avatar, ProfileName } from './style';

const PAGE_META = {
  '/': { title: 'Дашборд', subtitle: 'Общая сводка по объектам' },
  '/apartments': { title: 'Квартиры', subtitle: 'Все объекты в управлении' },
  '/tenants': { title: 'Жильцы', subtitle: 'Текущие и бывшие арендаторы' },
  '/payments': { title: 'Платежи', subtitle: 'История начислений и оплат' },
  '/settings': { title: 'Настройки', subtitle: 'Параметры аккаунта' },
};

export const Header = () => {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? { title: 'Риелтор CRM', subtitle: '' };

  return (
    <Bar>
      <TitleBlock>
        <Title>{meta.title}</Title>
        {meta.subtitle && <Subtitle>{meta.subtitle}</Subtitle>}
      </TitleBlock>

      <Profile>
        <Avatar>АИ</Avatar>
        <ProfileName>Агент Иванов</ProfileName>
      </Profile>
    </Bar>
  );
};
