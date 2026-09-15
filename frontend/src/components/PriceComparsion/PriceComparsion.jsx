import { useState } from 'react';
import { usePriceStats } from '../../shared/modules/usePriceStats/usePriceStats';
import { Wrapper, Title, ChartArea, Bar, BarLabel, Tooltip, Axis } from './style';

const CHART_HEIGHT = 220;
const BAR_WIDTH = 56;
const BAR_GAP = 32;

export const PriceComparisonChart = () => {
  const { groups, isLoading, error } = usePriceStats();
  const [hovered, setHovered] = useState(null); // было useState<number | null>(null)

  if (isLoading) return <Wrapper>Загрузка графика...</Wrapper>;
  if (error) return <Wrapper>Ошибка загрузки статистики: {error}</Wrapper>;
  if (groups.length === 0) return <Wrapper>Недостаточно данных для графика</Wrapper>;

  const maxPrice = Math.max(...groups.map((g) => g.median_price));
  const svgWidth = groups.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;

  return (
    <Wrapper>
      <Title>Медианная арендная ставка по количеству комнат</Title>
      <ChartArea>
        <svg width={svgWidth} height={CHART_HEIGHT + 40} viewBox={`0 0 ${svgWidth} ${CHART_HEIGHT + 40}`}>
          <Axis x1={0} y1={CHART_HEIGHT} x2={svgWidth} y2={CHART_HEIGHT} />
          {groups.map((g, i) => {
            const barHeight = (g.median_price / maxPrice) * (CHART_HEIGHT - 20);
            const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
            const y = CHART_HEIGHT - barHeight;
            return (
              <g key={g.label}>
                <Bar
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barHeight}
                  $isHovered={hovered === i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
                <BarLabel x={x + BAR_WIDTH / 2} y={CHART_HEIGHT + 20}>
                  {g.label} комн.
                </BarLabel>
                {hovered === i && (
                  <foreignObject x={x - 45} y={y - 95} width={170} height={85}>
                    <Tooltip>
                      <strong>{g.label}-комнатные</strong>
                      <div>Медиана: {g.median_price.toLocaleString('ru-RU')} ₽</div>
                      <div>
                        Разброс: {g.min_price.toLocaleString('ru-RU')}–{g.max_price.toLocaleString('ru-RU')} ₽
                      </div>
                      <div>Объектов: {g.count}</div>
                    </Tooltip>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </ChartArea>
    </Wrapper>
  );
};
