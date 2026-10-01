import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bar,
  TitleBlock,
  Title,
  Subtitle,
  ProfileWrapper,
  ProfileButton,
  Avatar,
  ProfileName,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Input,
  PrimaryButton,
  SecondaryButton,
  ErrorText,
} from './style';

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Дашборд', subtitle: 'Общая сводка по объектам' },
  '/apartments': { title: 'Квартиры', subtitle: 'Все объекты в управлении' },
  '/tenants': { title: 'Жильцы', subtitle: 'Текущие и бывшие арендаторы' },
  '/payments': { title: 'Платежи', subtitle: 'История начислений и оплат' },
  '/settings': { title: 'Настройки', subtitle: 'Параметры аккаунта' },
};

interface UserProfile {
  id: number;
  email: string;
  full_name: string;
}

export const Header = () => {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? { title: 'Риелтор CRM', subtitle: '' };

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Форма входа
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Считываем сохраненного пользователя из localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Ошибка чтения профиля из localStorage', e);
      }
    }

    // Закрытие выпадающего списка при клике вне его
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Выполнение входа через FastAPI API
  const loginUser = async (loginEmail: string, loginPass: string) => {
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Неверный email или пароль');
      }

      // Сохраняем токен и пользователя
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Обновляем состояние и перезагружаем данные на странице
      setUser(data.user);
      setIsDropdownOpen(false);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email, password);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    window.location.reload();
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <Bar>
        <TitleBlock>
          <Title>{meta.title}</Title>
          {meta.subtitle && <Subtitle>{meta.subtitle}</Subtitle>}
        </TitleBlock>

        <ProfileWrapper ref={dropdownRef}>
          <ProfileButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Avatar>{getInitials(user ? user.full_name : 'Войти')}</Avatar>
            <ProfileName>{user ? user.full_name : 'Не авторизован'}</ProfileName>
          </ProfileButton>

          {isDropdownOpen && (
            <Dropdown>
              <DropdownHeader>Быстрый выбор</DropdownHeader>
              <DropdownItem
                active={user?.email === 'ivanov@example.com'}
                onClick={() => loginUser('ivanov@example.com', 'password123')}
              >
                <span>Агент Иванов</span>
                {user?.email === 'ivanov@example.com' && '✓'}
              </DropdownItem>
              <DropdownItem
                active={user?.email === 'petrov@example.com'}
                onClick={() => loginUser('petrov@example.com', 'password123')}
              >
                <span>Агент Петров</span>
                {user?.email === 'petrov@example.com' && '✓'}
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsModalOpen(true);
                }}
              >
                Ввести логин/пароль...
              </DropdownItem>

              {user && (
                <>
                  <DropdownDivider />
                  <DropdownItem onClick={handleLogout} style={{ color: '#e53e3e' }}>
                    Выйти
                  </DropdownItem>
                </>
              )}
            </Dropdown>
          )}
        </ProfileWrapper>
      </Bar>

      {/* Модальное окно ручного входа */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} onSubmit={handleFormSubmit}>
            <ModalTitle>Авторизация риелтора</ModalTitle>
            {error && <ErrorText>{error}</ErrorText>}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PrimaryButton type="submit">Войти</PrimaryButton>
            <SecondaryButton type="button" onClick={() => setIsModalOpen(false)}>
              Отмена
            </SecondaryButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};
