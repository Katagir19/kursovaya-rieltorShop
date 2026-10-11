import { useApartaments } from '../../shared/hooks/useApartaments/useApartaments';
import { MedianChart } from './MedianChart/MedianChart';
import { Wrapper, Title, Subtitle, Message } from './style';

export const Dashboard = () => {
  const { apartaments, isLoading, error } = useApartaments();

  return (
    <Wrapper>
      <div>
        <Title>Сводка</Title>
        <Subtitle>Медиана аренды по моим квартирам в сравнении с объявлениями на Авито</Subtitle>
      </div>
      {error && <Message>Не удалось загрузить мои квартиры: {error}. На графике только данные Авито.</Message>}
      {isLoading ? <Message>Загрузка...</Message> : <MedianChart apartaments={apartaments} />}
    </Wrapper>
  );
};
