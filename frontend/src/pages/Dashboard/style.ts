import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

export const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 13.5px;
  color: ${theme.colors.textSecondary};
`;

export const Message = styled.p`
  margin: 0;
  font-size: 13.5px;
  color: ${theme.colors.textSecondary};
`;
