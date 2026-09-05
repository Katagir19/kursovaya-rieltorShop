import {
  Aside,
  Brand,
  BrandMark,
  Nav,
  NavGroupLabel,
  NavItem,
  Spacer,
  Footer,
} from './style';
import {
  IconKey,
  IconGrid,
  IconBuilding,
  IconUsers,
  IconReceipt,
  IconSettings,
} from '../../icons';

const NAV_ITEMS = [
  { to: '/', label: 'Дашборд', icon: IconGrid, end: true },
  { to: '/apartments', label: 'Квартиры', icon: IconBuilding },
  { to: '/tenants', label: 'Жильцы', icon: IconUsers },
  { to: '/payments', label: 'Платежи', icon: IconReceipt },
];

export const Sidebar = () => {
  return (
    <Aside>
      <Brand>
        <BrandMark>
          <IconKey />
        </BrandMark>
        Риелтор CRM
      </Brand>

      <NavGroupLabel>Управление</NavGroupLabel>
      <Nav>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavItem key={to} to={to} end={end}>
            <Icon />
            {label}
          </NavItem>
        ))}
      </Nav>

      <Spacer />

      <Footer>
        <Nav>
          <NavItem to="/settings">
            <IconSettings />
            Настройки
          </NavItem>
        </Nav>
      </Footer>
    </Aside>
  );
};
