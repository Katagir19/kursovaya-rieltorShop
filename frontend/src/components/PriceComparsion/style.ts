import styled from '@emotion/styled';

export const Wrapper = styled.div`
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`;

export const Title = styled.h3`
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
`;

export const ChartArea = styled.div`
  overflow-x: auto;
  position: relative;
`;

export const Axis = styled.line`
  stroke: #e2e2e2;
  stroke-width: 1;
`;

export const Bar = styled.rect<{ $isHovered: boolean }>`
  fill: ${({ $isHovered }) => ($isHovered ? '#6c5ce7' : '#a29bfe')};
  rx: 4;
  transition: fill 0.15s ease;
  cursor: pointer;
`;

export const BarLabel = styled.text`
  font-size: 12px;
  fill: #666;
  text-anchor: middle;
`;

export const Tooltip = styled.div`
  background: #2d2d2d;
  color: #fff;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
  pointer-events: none;
  white-space: nowrap;
`;
