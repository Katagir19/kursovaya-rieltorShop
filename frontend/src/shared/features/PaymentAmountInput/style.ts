import styled from '@emotion/styled';
import { theme } from '../../../theme';

export const AmountBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(0, 0, 0, 0.02);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.hairline};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.hairline};
  border-radius: 6px;
  padding: 4px 10px;

  &:focus-within {
    border-color: ${theme.colors.accent};
  }
`;

export const Input = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-family: ${theme.font.mono};
  font-size: 13px;
  width: 90px;
  color: ${theme.colors.textPrimary};

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const Symbol = styled.span`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;

export const StatusMessage = styled.div<{ type: 'success' | 'warning' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  padding: 7px 10px;
  border-radius: 6px;
  background: ${({ type }) =>
    type === 'success'
      ? 'rgba(46, 125, 50, 0.1)'
      : type === 'warning'
      ? 'rgba(237, 108, 2, 0.1)'
      : 'rgba(211, 47, 47, 0.1)'};
  color: ${({ type }) =>
    type === 'success' ? '#2e7d32' : type === 'warning' ? '#c75100' : '#d32f2f'};
`;
