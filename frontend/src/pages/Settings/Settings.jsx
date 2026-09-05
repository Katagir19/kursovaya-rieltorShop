import { EmptyState } from '../../components/EmptyState/EmptyState';
import { IconSettings } from '../../icons';
import { Wrapper } from './style';

export const Settings = () => {
  return (
    <Wrapper>
      <EmptyState
        icon={<IconSettings />}
        title="Настроек пока нет"
        description="Здесь будут параметры аккаунта: данные агента, уведомления и реквизиты для платежей."
      />
    </Wrapper>
  );
};
