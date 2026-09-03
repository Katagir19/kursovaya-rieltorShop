import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Shell = styled.div`
  display: grid;
  grid-template-columns: ${theme.layout.sidebarWidth} 1fr;
  min-height: 100vh;
  background: ${theme.colors.paper};
  font-family: ${theme.font.sans};
  color: ${theme.colors.textPrimary};

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Main = styled.main`
  flex: 1;
  padding: 32px 40px 48px;

  @media (max-width: 640px) {
    padding: 20px;
  }
`;
