import styled from '@emotion/styled';
import { theme } from '../../../theme';

export const Card = styled.article`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.hairline};
  border-radius: ${theme.radius.md};
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const Name = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

type Tone = 'good' | 'warn' | 'neutral';

const TONE_COLORS: Record<Tone, { fg: string; bg: string }> = {
  good: { fg: theme.colors.statusGood, bg: 'rgba(63, 125, 88, 0.12)' },
  warn: { fg: theme.colors.statusWarn, bg: theme.colors.accentSoft },
  neutral: { fg: theme.colors.textSecondary, bg: 'rgba(107, 114, 128, 0.12)' },
};

export const StatusBadge = styled.span<{ tone: Tone }>`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
  color: ${({ tone }) => TONE_COLORS[tone].fg};
  background: ${({ tone }) => TONE_COLORS[tone].bg};
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.hairline};
  margin: 0;
  width: 100%;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const IconSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: ${theme.colors.accent};

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const InfoText = styled.span<{ mono?: boolean }>`
  font-size: 13px;
  color: ${theme.colors.textPrimary};
  font-family: ${({ mono }) => (mono ? theme.font.mono : theme.font.sans)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Notes = styled.p`
  margin: 0;
  padding-top: 10px;
  border-top: 1px dashed ${theme.colors.hairline};
  font-size: 12.5px;
  font-style: italic;
  color: ${theme.colors.textSecondary};
`;

export const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: #1a1a1a;
  flex-shrink: 0;
  margin-left: 8px;

  svg {
    width: 18px;
    height: 18px;
    display: block;
  }

  &:hover path {
    color: red;
  }
`;
