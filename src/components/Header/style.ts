import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${theme.layout.headerHeight};
  padding: 0 40px;
  border-bottom: 1px solid ${theme.colors.hairline};
  background: ${theme.colors.surface};

  @media (max-width: 640px) {
    padding: 0 20px;
  }
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const Subtitle = styled.span`
  font-size: 12.5px;
  color: ${theme.colors.textSecondary};
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${theme.colors.ink};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  font-weight: 600;
  font-family: ${theme.font.mono};
`;

export const ProfileName = styled.span`
  font-size: 13.5px;
  color: ${theme.colors.textPrimary};

  @media (max-width: 640px) {
    display: none;
  }
`;
