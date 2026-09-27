import styled from '@emotion/styled';

export const ToggleContainer = styled.div<{ isPaid: boolean }>`
  display: inline-flex;
  align-items: center;
  background: ${({ isPaid }) => (isPaid ? '#e6f4ea' : '#fce8e6')};
  border: 1px solid ${({ isPaid }) => (isPaid ? '#34a853' : '#ea4335')};
  border-radius: 20px;
  padding: 2px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
`;

export const ToggleItem = styled.button<{ active: boolean; variant: 'paid' | 'unpaid' }>`
  border: none;
  background: ${({ active, variant }) =>
    active ? (variant === 'paid' ? '#2e7d32' : '#d32f2f') : 'transparent'};
  color: ${({ active }) => (active ? '#ffffff' : '#5f6368')};
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;