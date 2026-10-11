# Kursovaya — Rieltor Shop
 
Информационная система для арендодателей. Позволяет хранить и просматривать информацию о жильцах, апартаментах и платежах.
 
> Курсовая работа. Проект разрабатывается и запускается локально.
 
## Возможности
 
- **Жильцы** — карточки жильцов со всей информацией о каждом из них
- **Апартаменты** — список апартаментов, карточки с подробной информацией, добавление новых
- **Платежи** — учёт платежей
- **Dashboard** — сводная страница(в разработке)
- **Settings** — настройки(в разработке)

## Технологии
 
| Часть | Технологии |
|-------|-----------|
| Фронтенд | React, TypeScript, Vite |
| Бэкенд | Python, FastAPI, Uvicorn |
| База данных | MySQL (локально через XAMPP) |
 
## Структура проекта
 
```
kursovaya-rieltorShop/
├── backend/
│   └── backend.py          # FastAPI-сервер
└── frontend/               # React + TypeScript (Vite)
    └── src/
        ├── components/     # переиспользуемые компоненты
        │   ├── EmptyState/
        │   ├── FilterBar/
        │   ├── Header/
        │   ├── Layout/
        │   └── Sidebar/
        ├── pages/          # страницы приложения
        │   ├── Apartments/
        │   ├── Dashboard/
        │   ├── Payments/
        │   ├── Settings/
        │   └── Tenants/
        ├── shared/         # общий код
        │   ├── features/
        │   ├── hooks/
        │   ├── icons/
        │   ├── services/
        │   └── types/
        ├── App.tsx
        ├── main.jsx
        ├── index.css
        └── theme.ts
```
 
## Требования
 
- [Node.js](https://nodejs.org/) 
- [Python 3](https://www.python.org/) 
- [XAMPP](https://www.apachefriends.org/) (MySQL)

## Установка и запуск
 
### 1. База данных
 
1. Запустите **XAMPP Control Panel** и включите модули **Apache** и **MySQL**.
2. Откройте phpMyAdmin: <http://localhost/phpmyadmin>.
3. Создайте базу данных (realtor_db: название БД).
### 2. Бэкенд
 
```bash
cd backend
pip install -r requirements.txt   # проверить, что файл существует
py -m uvicorn backend:app --reload
```
 
Сервер будет доступен по адресу <http://127.0.0.1:8000>.
Интерактивная документация API (Swagger): <http://127.0.0.1:8000/docs>.
 
### 3. Фронтенд
 
```bash
cd frontend
npm install
npm run dev
```
 
Приложение откроется по адресу, который выведет Vite (по умолчанию <http://localhost:5173>).
 
## Статус
 
Проект запускается только локально, деплоя пока нет.