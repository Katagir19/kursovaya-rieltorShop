import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Panel = styled.section`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.hairline};
  border-radius: ${theme.radius.md};
  padding: 56px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 480px;
`;

export const IconWrap = styled.div`
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.accent};
  border: 1px solid ${theme.colors.hairline};
  border-radius: ${theme.radius.sm};
  margin-bottom: 18px;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Heading = styled.h2`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const Description = styled.p`
  margin: 0;
  font-size: 13.5px;
  line-height: 1.55;
  color: ${theme.colors.textSecondary};
`;
