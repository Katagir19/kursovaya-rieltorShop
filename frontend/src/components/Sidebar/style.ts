import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { theme } from '../../theme';

export const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  background: ${theme.colors.ink};
  padding: 24px 12px;

  @media (max-width: 860px) {
    display: none; /* на первой итерации мобильная навигация не входит в объём "обёртки" */
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 28px;
  color: #fff;
  font-weight: 600;
  font-size: 17px;
  letter-spacing: 0.01em;
`;

export const BrandMark = styled.span`
  display: inline-flex;
  width: 22px;
  height: 22px;
  color: ${theme.colors.accent};
  flex-shrink: 0;
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const NavGroupLabel = styled.div`
  padding: 18px 12px 6px;
  font-size: 11px;
  color: #566073;
  letter-spacing: 0.04em;
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.inkSoft};
  text-decoration: none;
  font-size: 14px;
  border-left: 2px solid transparent;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;

  svg {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
  }

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  &.active {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    border-left-color: ${theme.colors.accent};
  }
`;

export const Footer = styled.div`
  border-top: 1px solid ${theme.colors.hairlineDark};
  padding-top: 12px;
  margin-top: 12px;
`;
