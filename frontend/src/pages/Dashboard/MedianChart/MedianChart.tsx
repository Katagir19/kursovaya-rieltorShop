import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { Apartaments } from '../../../shared/types/apartment';
import { generateAvitoListings, roomsLabel } from '../../../shared/data/avitoListings';
import {
  Card,
  Toolbar,
  Segmented,
  SegmentButton,
  RefreshButton,
  Stats,
  Stat,
  StatValue,
  StatLabel,
  Legend,
  LegendItem,
  LegendKey,
  ChartArea,
  Svg,
  LinePath,
  Dot,
  Tooltip,
  TooltipTitle,
  TooltipRow,
  TooltipKey,
  TooltipValue,
  TooltipMuted,
  TooltipNote,
  Delta,
  TableToggle,
  Table,
  Hint,
} from './style';

const SERIES_COLORS = { mine: '#B08A3E', avito: '#2F6BB3' } as const;

const HEIGHT = 320;
const MARGIN = { top: 16, right: 96, bottom: 32, left: 64 };
const HIT_RADIUS = 14;

const ROOM_OPTIONS = [
  { label: 'Все', value: -1 },
  { label: 'Студия', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4+', value: 4 },
];

const PERIOD_OPTIONS = [3, 6, 12];

type Source = 'mine' | 'avito';

interface ChartPoint {
  id: string;
  source: Source;
  title: string;
  address: string;
  rooms: number;
  price: number;
  date: Date;
  details: string[];
}

interface MonthBucket {
  start: Date;
  end: Date;
  mine: number | null;
  avito: number | null;
  avitoCount: number;
}

type Hover =
  | { kind: 'point'; point: ChartPoint; x: number; y: number }
  | { kind: 'month'; index: number; x: number };

const median = (values: number[]) => {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// В карточке квартиры комнаты — свободный текст ("2-комнатная квартира", "студия")
const parseRooms = (value: string) => {
  if (/студ/i.test(value)) return 0;
  const match = value.match(/\d+/);
  return match ? Math.min(4, Number(match[0])) : null;
};

const matchesRooms = (rooms: number, filter: number) =>
  filter === -1 || (filter === 4 ? rooms >= 4 : rooms === filter);

const formatPrice = (value: number) => `${Math.round(value).toLocaleString('ru-RU')} ₽`;
const formatShortPrice = (value: number) => `${Math.round(value / 1000)} тыс`;
const formatDate = (date: Date) => date.toLocaleDateString('ru-RU');
const formatMonth = (date: Date) => date.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '');

const formatDelta = (value: number, base: number | null) => {
  if (!base) return null;
  const percent = ((value - base) / base) * 100;
  return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
};

const buildPath = (points: { x: number; y: number }[]) =>
  points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

// "Красивые" деления оси Y с шагом 5/10/20 тыс.
const niceTicks = (min: number, max: number) => {
  const raw = (max - min) / 5;
  const step = [5000, 10000, 20000, 50000].find((s) => s >= raw) ?? 100000;
  const from = Math.floor(min / step) * step;
  const to = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let value = from; value <= to; value += step) ticks.push(value);
  return ticks;
};

interface MedianChartProps {
  apartaments: Apartaments[];
}

export const MedianChart = ({ apartaments }: MedianChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [roomsFilter, setRoomsFilter] = useState(-1);
  const [months, setMonths] = useState(12);
  const [seed, setSeed] = useState(42);
  const [hover, setHover] = useState<Hover | null>(null);
  const [showTable, setShowTable] = useState(false);

  // Меряем ширину до первой отрисовки, чтобы точки не "переезжали" при загрузке
  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    setWidth(node.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const avitoListings = useMemo(() => generateAvitoListings(seed), [seed]);

  const now = useMemo(() => new Date(), []);
  const windowStart = useMemo(
    () => new Date(now.getFullYear(), now.getMonth() - (months - 1), 1),
    [now, months],
  );

  const allPoints = useMemo<ChartPoint[]>(() => {
    const mine = apartaments.flatMap((apartament) => {
      const rooms = parseRooms(apartament.rooms);
      if (rooms === null || !apartament.price) return [];
      return [
        {
          id: `mine-${apartament.id}`,
          source: 'mine' as const,
          title: apartament.title,
          address: apartament.address,
          rooms,
          price: apartament.price,
          date: new Date(apartament.created_at),
          details: [`Статус: ${apartament.status}`],
        },
      ];
    });

    const avito = avitoListings.map((listing) => ({
      id: listing.id,
      source: 'avito' as const,
      title: listing.title,
      address: listing.address,
      rooms: listing.rooms,
      price: listing.price,
      date: new Date(listing.published_at),
      details: [
        `Район: ${listing.district}`,
        `Этаж: ${listing.floor} из ${listing.floors}`,
      ],
    }));

    return [...mine, ...avito];
  }, [apartaments, avitoListings]);

  const filtered = useMemo(
    () => allPoints.filter((point) => matchesRooms(point.rooms, roomsFilter)),
    [allPoints, roomsFilter],
  );

  const buckets = useMemo<MonthBucket[]>(
    () =>
      Array.from({ length: months }, (_, i) => {
        const start = new Date(windowStart.getFullYear(), windowStart.getMonth() + i, 1);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        const avitoPrices = filtered
          .filter((p) => p.source === 'avito' && p.date >= start && p.date < end)
          .map((p) => p.price);
        // Моя медиана — по всему портфелю, который был в управлении на конец месяца
        const minePrices = filtered.filter((p) => p.source === 'mine' && p.date < end).map((p) => p.price);
        return {
          start,
          end,
          mine: median(minePrices),
          avito: median(avitoPrices),
          avitoCount: avitoPrices.length,
        };
      }),
    [filtered, months, windowStart],
  );

  // Медиана рынка по каждому типу квартир — для сравнения в подсказке
  const marketByRooms = useMemo(() => {
    const result = new Map<number, number | null>();
    for (let rooms = 0; rooms <= 4; rooms++) {
      result.set(
        rooms,
        median(
          allPoints
            .filter((p) => p.source === 'avito' && p.rooms === rooms && p.date >= windowStart)
            .map((p) => p.price),
        ),
      );
    }
    return result;
  }, [allPoints, windowStart]);

  const visiblePoints = useMemo(
    () => filtered.filter((p) => p.source === 'mine' || p.date >= windowStart),
    [filtered, windowStart],
  );

  const mineMedian = median(filtered.filter((p) => p.source === 'mine').map((p) => p.price));
  const avitoMedian = median(
    filtered.filter((p) => p.source === 'avito' && p.date >= windowStart).map((p) => p.price),
  );

  // Геометрия
  const innerWidth = Math.max(200, width - MARGIN.left - MARGIN.right);
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const startTime = windowStart.getTime();
  const endTime = now.getTime();
  const xScale = (date: Date) => {
    const time = Math.min(endTime, Math.max(startTime, date.getTime()));
    return MARGIN.left + ((time - startTime) / (endTime - startTime)) * innerWidth;
  };

  const prices = visiblePoints.map((p) => p.price);
  const ticks = niceTicks(Math.min(...prices, 20000), Math.max(...prices, 40000));
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];
  const yScale = (value: number) => MARGIN.top + innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight;

  const bucketCenter = (bucket: MonthBucket) =>
    xScale(new Date((bucket.start.getTime() + Math.min(bucket.end.getTime(), endTime)) / 2));

  const linePoints = (key: Source) =>
    buckets.flatMap((bucket) =>
      bucket[key] === null ? [] : [{ x: bucketCenter(bucket), y: yScale(bucket[key] as number) }],
    );
  const mineLine = linePoints('mine');
  const avitoLine = linePoints('avito');

  const handlePointerMove = (event: PointerEvent<SVGRectElement>) => {
    const rect = event.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;

    let nearest: { point: ChartPoint; x: number; y: number; distance: number } | null = null;
    for (const point of visiblePoints) {
      const x = xScale(point.date);
      const y = yScale(point.price);
      const distance = Math.hypot(x - px, y - py);
      // Мои квартиры важнее — при равном расстоянии выигрывают они
      const weighted = point.source === 'mine' ? distance - 4 : distance;
      if (weighted <= HIT_RADIUS && (!nearest || weighted < nearest.distance)) {
        nearest = { point, x, y, distance: weighted };
      }
    }

    if (nearest) {
      setHover({ kind: 'point', point: nearest.point, x: nearest.x, y: nearest.y });
      return;
    }

    const index = buckets.reduce(
      (best, bucket, i) =>
        Math.abs(bucketCenter(bucket) - px) < Math.abs(bucketCenter(buckets[best]) - px) ? i : best,
      0,
    );
    setHover({ kind: 'month', index, x: bucketCenter(buckets[index]) });
  };

  const renderTooltip = () => {
    if (!hover) return null;

    if (hover.kind === 'month') {
      const bucket = buckets[hover.index];
      return (
        <Tooltip style={{ left: hover.x, top: MARGIN.top }} flip={hover.x > width - 220}>
          <TooltipTitle>
            {bucket.start.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
          </TooltipTitle>
          <TooltipRow>
            <TooltipKey color={SERIES_COLORS.mine} />
            <TooltipValue>{bucket.mine === null ? '—' : formatPrice(bucket.mine)}</TooltipValue>
            <TooltipNote>мои</TooltipNote>
          </TooltipRow>
          <TooltipRow>
            <TooltipKey color={SERIES_COLORS.avito} />
            <TooltipValue>{bucket.avito === null ? '—' : formatPrice(bucket.avito)}</TooltipValue>
            <TooltipNote>Авито · {bucket.avitoCount} объявл.</TooltipNote>
          </TooltipRow>
        </Tooltip>
      );
    }

    const { point } = hover;
    const market = marketByRooms.get(Math.min(4, point.rooms)) ?? null;
    const delta = formatDelta(point.price, market);
    return (
      <Tooltip style={{ left: hover.x, top: hover.y + 14 }} flip={hover.x > width - 260}>
        <TooltipMuted>{point.source === 'mine' ? 'Моя квартира' : 'Объявление Авито'}</TooltipMuted>
        <TooltipTitle>{point.title}</TooltipTitle>
        <TooltipMuted>{point.address}</TooltipMuted>
        <TooltipRow>
          <TooltipKey color={SERIES_COLORS[point.source]} />
          <TooltipValue>{formatPrice(point.price)}</TooltipValue>
          <TooltipNote>/ мес · {roomsLabel(point.rooms)}</TooltipNote>
        </TooltipRow>
        {point.details.map((line) => (
          <TooltipMuted key={line}>{line}</TooltipMuted>
        ))}
        <TooltipMuted>
          {point.source === 'mine' ? 'Добавлена' : 'Опубликовано'}: {formatDate(point.date)}
        </TooltipMuted>
        {delta && (
          <TooltipMuted>
            К медиане рынка ({roomsLabel(point.rooms)}):{' '}
            <Delta positive={point.price >= (market ?? 0)}>{delta}</Delta>
          </TooltipMuted>
        )}
      </Tooltip>
    );
  };

  const lastMine = mineLine[mineLine.length - 1];
  const lastAvito = avitoLine[avitoLine.length - 1];
  // Разводим подписи на концах линий, если они налезают друг на друга
  const labelOffset = lastMine && lastAvito && Math.abs(lastMine.y - lastAvito.y) < 14 ? 8 : 0;
  const mineAbove = lastMine && lastAvito ? lastMine.y <= lastAvito.y : true;
  const delta = mineMedian !== null ? formatDelta(mineMedian, avitoMedian) : null;

  return (
    <Card>
      <Toolbar>
        <Segmented aria-label="Комнат">
          {ROOM_OPTIONS.map((option) => (
            <SegmentButton
              key={option.value}
              active={roomsFilter === option.value}
              onClick={() => setRoomsFilter(option.value)}
            >
              {option.label}
            </SegmentButton>
          ))}
        </Segmented>
        <Segmented aria-label="Период">
          {PERIOD_OPTIONS.map((option) => (
            <SegmentButton key={option} active={months === option} onClick={() => setMonths(option)}>
              {option} мес
            </SegmentButton>
          ))}
        </Segmented>
        <RefreshButton onClick={() => setSeed((value) => value + 1)}>Обновить данные Авито</RefreshButton>
      </Toolbar>

      <Stats>
        <Stat>
          <StatValue>{mineMedian === null ? '—' : formatPrice(mineMedian)}</StatValue>
          <StatLabel>Медиана моих квартир</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{avitoMedian === null ? '—' : formatPrice(avitoMedian)}</StatValue>
          <StatLabel>Медиана Авито за {months} мес</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{delta ?? '—'}</StatValue>
          <StatLabel>Мои цены относительно рынка</StatLabel>
        </Stat>
      </Stats>

      <Legend>
        <LegendItem>
          <LegendKey color={SERIES_COLORS.mine} />
          Мои квартиры — медиана портфеля
        </LegendItem>
        <LegendItem>
          <LegendKey color={SERIES_COLORS.avito} />
          Авито — медиана объявлений за месяц
        </LegendItem>
      </Legend>

      <ChartArea ref={containerRef} onPointerLeave={() => setHover(null)}>
        <Svg width={width} height={HEIGHT} role="img" aria-label="Медиана цен аренды: мои квартиры и Авито">
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + innerWidth}
                y1={yScale(tick)}
                y2={yScale(tick)}
                className="grid"
              />
              <text x={MARGIN.left - 8} y={yScale(tick)} className="axis" textAnchor="end" dy="0.32em">
                {formatShortPrice(tick)}
              </text>
            </g>
          ))}
          {buckets.map((bucket) => (
            <text
              key={bucket.start.toISOString()}
              x={bucketCenter(bucket)}
              y={HEIGHT - 10}
              className="axis"
              textAnchor="middle"
            >
              {formatMonth(bucket.start)}
            </text>
          ))}

          {hover?.kind === 'month' && (
            <line
              x1={hover.x}
              x2={hover.x}
              y1={MARGIN.top}
              y2={MARGIN.top + innerHeight}
              className="crosshair"
            />
          )}

          {visiblePoints
            .filter((p) => p.source === 'avito')
            .map((p) => (
              <Dot
                key={p.id}
                cx={xScale(p.date)}
                cy={yScale(p.price)}
                r={3}
                fill={SERIES_COLORS.avito}
                faded
                active={hover?.kind === 'point' && hover.point.id === p.id}
              />
            ))}

          <LinePath d={buildPath(avitoLine)} stroke={SERIES_COLORS.avito} />
          <LinePath d={buildPath(mineLine)} stroke={SERIES_COLORS.mine} />

          {hover?.kind === 'month' &&
            (['avito', 'mine'] as const).map((key) => {
              const value = buckets[hover.index][key];
              return value === null ? null : (
                <circle
                  key={key}
                  cx={hover.x}
                  cy={yScale(value)}
                  r={4.5}
                  fill={SERIES_COLORS[key]}
                  className="ring"
                />
              );
            })}

          {visiblePoints
            .filter((p) => p.source === 'mine')
            .map((p) => (
              <Dot
                key={p.id}
                cx={xScale(p.date)}
                cy={yScale(p.price)}
                r={5}
                fill={SERIES_COLORS.mine}
                active={hover?.kind === 'point' && hover.point.id === p.id}
              />
            ))}

          {lastMine && (
            <text
              x={lastMine.x + 10}
              y={lastMine.y + (mineAbove ? -labelOffset : labelOffset)}
              dy="0.32em"
              className="label"
            >
              Мои
            </text>
          )}
          {lastAvito && (
            <text
              x={lastAvito.x + 10}
              y={lastAvito.y + (mineAbove ? labelOffset : -labelOffset)}
              dy="0.32em"
              className="label"
            >
              Авито
            </text>
          )}

          <rect
            x={MARGIN.left}
            y={MARGIN.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onPointerMove={handlePointerMove}
          />
        </Svg>
        {renderTooltip()}
      </ChartArea>

      {mineLine.length === 0 && (
        <Hint>
          Нет своих квартир с распознаваемым числом комнат и ценой — добавьте квартиру (например, «2-комнатная»),
          чтобы увидеть свою медиану.
        </Hint>
      )}

      <TableToggle onClick={() => setShowTable((value) => !value)}>
        {showTable ? 'Скрыть таблицу' : 'Показать таблицей'}
      </TableToggle>
      {showTable && (
        <Table>
          <thead>
            <tr>
              <th>Месяц</th>
              <th>Мои, медиана</th>
              <th>Авито, медиана</th>
              <th>Объявлений</th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((bucket) => (
              <tr key={bucket.start.toISOString()}>
                <td>{bucket.start.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</td>
                <td>{bucket.mine === null ? '—' : formatPrice(bucket.mine)}</td>
                <td>{bucket.avito === null ? '—' : formatPrice(bucket.avito)}</td>
                <td>{bucket.avitoCount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
};
