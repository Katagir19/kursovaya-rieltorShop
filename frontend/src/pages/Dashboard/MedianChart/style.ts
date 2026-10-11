import styled from '@emotion/styled';
import { theme } from '../../../theme';

export const Card = styled.section`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.hairline};
  border-radius: ${theme.radius.md};
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

export const Segmented = styled.div`
  display: inline-flex;
  border: 1px solid ${theme.colors.hairline};
  border-radius: ${theme.radius.sm};
  overflow: hidden;
`;

export const SegmentButton = styled.button<{ active: boolean }>`
  border: none;
  border-right: 1px solid ${theme.colors.hairline};
  background: ${({ active }) => (active ? theme.colors.ink : 'transparent')};
  color: ${({ active }) => (active ? theme.colors.surface : theme.colors.textSecondary)};
  font: 500 13px ${theme.font.sans};
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:last-of-type {
    border-right: none;
  }

  &:hover {
    color: ${({ active }) => (active ? theme.colors.surface : theme.colors.textPrimary)};
  }
`;

export const RefreshButton = styled.button`
  margin-left: auto;
  border: 1px solid ${theme.colors.hairline};
  border-radius: ${theme.radius.sm};
  background: transparent;
  color: ${theme.colors.textPrimary};
  font: 500 13px ${theme.font.sans};
  padding: 6px 12px;
  cursor: pointer;

  &:hover {
    background: ${theme.colors.accentSoft};
  }
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

export const Stat = styled.div`
  border-left: 2px solid ${theme.colors.hairline};
  padding-left: 12px;
`;

export const StatValue = styled.div`
  font: 600 22px ${theme.font.mono};
  color: ${theme.colors.textPrimary};
`;

export const StatLabel = styled.div`
  font-size: 12.5px;
  color: ${theme.colors.textSecondary};
  margin-top: 2px;
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`;

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const LegendKey = styled.span<{ color: string }>`
  width: 16px;
  height: 2px;
  border-radius: 1px;
  background: ${({ color }) => color};
`;

export const ChartArea = styled.div`
  position: relative;
  width: 100%;
`;

export const Svg = styled.svg`
  display: block;
  overflow: visible;
  font-family: ${theme.font.sans};

  .grid {
    stroke: ${theme.colors.hairline};
    stroke-width: 1;
  }

  .axis {
    font-size: 11.5px;
    fill: ${theme.colors.inkSoft};
  }

  .label {
    font-size: 12px;
    font-weight: 600;
    fill: ${theme.colors.textPrimary};
  }

  .crosshair {
    stroke: ${theme.colors.inkSoft};
    stroke-width: 1;
    stroke-dasharray: 3 3;
  }

  .ring {
    stroke: ${theme.colors.surface};
    stroke-width: 2;
  }

  text {
    pointer-events: none;
  }
`;

export const LinePath = styled.path`
  fill: none;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
  pointer-events: none;
  transition: d 0.5s ease;
`;

export const Dot = styled.circle<{ faded?: boolean; active?: boolean }>`
  stroke: ${theme.colors.surface};
  stroke-width: ${({ active }) => (active ? 3 : 2)};
  opacity: ${({ faded, active }) => (active ? 1 : faded ? 0.35 : 1)};
  pointer-events: none;
  transition: cx 0.5s ease, cy 0.5s ease, opacity 0.15s ease;
  ${({ active }) => active && `filter: drop-shadow(0 0 3px rgba(28, 36, 48, 0.35));`}
`;

export const Tooltip = styled.div<{ flip: boolean }>`
  position: absolute;
  transform: translateX(${({ flip }) => (flip ? 'calc(-100% - 12px)' : '12px')});
  min-width: 200px;
  max-width: 260px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.hairline};
  border-radius: ${theme.radius.md};
  box-shadow: 0 6px 20px rgba(28, 36, 48, 0.12);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  pointer-events: none;
  z-index: 10;
`;

export const TooltipTitle = styled.div`
  font-size: 13.5px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 2px 0;
`;

export const TooltipKey = styled.span<{ color: string }>`
  width: 12px;
  height: 2px;
  border-radius: 1px;
  background: ${({ color }) => color};
  flex-shrink: 0;
`;

export const TooltipValue = styled.span`
  font: 600 14px ${theme.font.mono};
  color: ${theme.colors.textPrimary};
`;

export const TooltipMuted = styled.div`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;

export const TooltipNote = styled.span`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;

export const Delta = styled.span<{ positive: boolean }>`
  font-weight: 600;
  color: ${({ positive }) => (positive ? theme.colors.statusGood : theme.colors.statusBad)};
`;

export const Hint = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: ${theme.colors.textSecondary};
`;

export const TableToggle = styled.button`
  align-self: flex-start;
  border: none;
  background: none;
  padding: 0;
  font: 500 12.5px ${theme.font.sans};
  color: ${theme.colors.accent};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    text-align: left;
    padding: 6px 8px;
    border-bottom: 1px solid ${theme.colors.hairline};
  }

  th {
    color: ${theme.colors.textSecondary};
    font-weight: 500;
  }

  td:not(:first-of-type) {
    font-family: ${theme.font.mono};
  }
`;
