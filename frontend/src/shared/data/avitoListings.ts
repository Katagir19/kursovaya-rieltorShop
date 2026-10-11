// Условные объявления с Авито: генерируются детерминированно по seed,
// чтобы имитировать результат парсинга без реального запроса к сайту.

export interface AvitoListing {
  id: string;
  title: string;
  address: string;
  district: string;
  rooms: number; // 0 — студия
  area: number;
  floor: number;
  floors: number;
  price: number;
  published_at: string;
}

const STREETS = [
  'ул. Ленина',
  'пр-т Мира',
  'ул. Гагарина',
  'ул. Советская',
  'ул. Пушкина',
  'Садовая ул.',
  'ул. Кирова',
  'Набережная ул.',
  'ул. Строителей',
  'Лесной пер.',
  'ул. Чехова',
  'Октябрьский пр-т',
];

const DISTRICTS = ['Центральный', 'Северный', 'Заречный', 'Ленинский', 'Южный'];

// Надбавка к цене по району: центр дороже окраин
const DISTRICT_FACTOR: Record<string, number> = {
  Центральный: 1.25,
  Северный: 1,
  Заречный: 0.9,
  Ленинский: 1.05,
  Южный: 0.92,
};

// Базовая аренда в месяц и площадь по числу комнат
const ROOM_PROFILE = [
  { price: 28000, area: 26 },
  { price: 35000, area: 38 },
  { price: 48000, area: 55 },
  { price: 62000, area: 74 },
  { price: 80000, area: 95 },
];

// mulberry32 — простой ГПСЧ с seed
const createRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const roomsLabel = (rooms: number) => (rooms === 0 ? 'Студия' : `${rooms}-комн.`);

export const generateAvitoListings = (seed = 42, count = 180, months = 12): AvitoListing[] => {
  const random = createRandom(seed);
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1).getTime();
  const span = now.getTime() - start;

  return Array.from({ length: count }, (_, index) => {
    const rooms = Math.min(4, Math.floor(random() * random() * 5 + random() * 1.5));
    const profile = ROOM_PROFILE[rooms];
    const district = pick(DISTRICTS);
    const publishedAt = start + random() * span;
    // Рынок дорожает примерно на 8% за год
    const trend = 1 + 0.08 * ((publishedAt - start) / span);
    const noise = 0.82 + random() * 0.36;
    const price = Math.round((profile.price * DISTRICT_FACTOR[district] * trend * noise) / 500) * 500;
    const floors = pick([5, 9, 12, 16, 17, 25]);
    const area = Math.round(profile.area * (0.85 + random() * 0.3));

    return {
      id: `avito-${seed}-${index}`,
      title: `${rooms === 0 ? 'Квартира-студия' : `${rooms}-к. квартира`}, ${area} м²`,
      address: `${pick(STREETS)}, ${1 + Math.floor(random() * 120)}`,
      district,
      rooms,
      area,
      floor: 1 + Math.floor(random() * floors),
      floors,
      price,
      published_at: new Date(publishedAt).toISOString(),
    };
  });
};
