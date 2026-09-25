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

export const ProfileWrapper = styled.div`
  position: relative;
`;

export const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.hairline};
  }
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
  font-weight: 500;

  @media (max-width: 640px) {
    display: none;
  }
`;

// --- Новые стили для выпадающего меню и авторизации ---

export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 230px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.hairline};
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 8px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DropdownHeader = styled.div`
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${theme.colors.textSecondary};
`;

export const DropdownItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: ${(props) => (props.active ? theme.colors.hairline : 'transparent')};
  border-radius: 6px;
  font-size: 13px;
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${theme.colors.hairline};
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: ${theme.colors.hairline};
  margin: 4px 0;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.form`
  background: ${theme.colors.surface};
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.hairline};
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  font-size: 13.5px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.ink};
  }
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: ${theme.colors.ink};
  color: #fff;
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: transparent;
  color: ${theme.colors.textSecondary};

  &:hover {
    background: ${theme.colors.hairline};
    color: ${theme.colors.textPrimary};
  }
`;

export const ErrorText = styled.span`
  color: #e53e3e;
  font-size: 12px;
`;
