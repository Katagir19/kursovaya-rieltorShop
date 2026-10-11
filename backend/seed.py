"""Наполнение realtor_db тестовыми данными.

Создаёт 3 новых пользователей (если их ещё нет), 100 квартир и 100 жильцов,
поровну распределяет их между всеми пользователями и заселяет часть жильцов
в квартиры своего же пользователя. Запуск из папки backend:  py seed.py
"""
import random
from datetime import datetime, timedelta

import bcrypt
import mysql.connector

APARTMENTS_TOTAL = 100
TENANTS_TOTAL = 100
OCCUPIED_SHARE = 0.65

NEW_USERS = [
    ("sidorova@example.com", "Агент Сидорова"),
    ("kuznetsov@example.com", "Агент Кузнецов"),
    ("morozova@example.com", "Агент Морозова"),
]
PASSWORD = "password123"

FIRST_NAMES_M = ["Александр", "Дмитрий", "Максим", "Сергей", "Андрей", "Алексей", "Артём", "Илья", "Кирилл", "Михаил", "Никита", "Иван", "Егор", "Павел", "Роман"]
FIRST_NAMES_F = ["Анна", "Мария", "Елена", "Ольга", "Татьяна", "Наталья", "Ирина", "Екатерина", "Дарья", "Полина", "Алина", "Виктория", "Ксения", "София", "Юлия"]
LAST_NAMES = ["Смирнов", "Иванов", "Кузнецов", "Попов", "Васильев", "Петров", "Соколов", "Михайлов", "Новиков", "Фёдоров", "Морозов", "Волков", "Алексеев", "Лебедев", "Семёнов", "Егоров", "Павлов", "Козлов", "Степанов", "Николаев"]

STREETS = ["ул. Ленина", "пр-т Мира", "ул. Гагарина", "ул. Советская", "ул. Пушкина", "Садовая ул.", "ул. Кирова", "Набережная ул.", "ул. Строителей", "Лесной пер.", "ул. Чехова", "Октябрьский пр-т"]
DISTRICTS = {"Центральный": 1.25, "Северный": 1.0, "Заречный": 0.9, "Ленинский": 1.05, "Южный": 0.92}

# (комнат, подпись, базовая аренда, площадь)
ROOM_TYPES = [
    (0, "Студия", 28000, 26),
    (1, "1-комнатная квартира", 35000, 38),
    (2, "2-комнатная квартира", 48000, 55),
    (3, "3-комнатная квартира", 62000, 74),
    (4, "4-комнатная квартира", 80000, 95),
]
ROOM_WEIGHTS = [15, 35, 30, 15, 5]

TITLE_TEMPLATES = ["Уютная {r}", "Светлая {r}", "{R} у парка", "{R} рядом с метро", "Просторная {r}", "{R} с евроремонтом", "{R} в новостройке", "Тихая {r} во дворе"]
TENANT_NOTES = ["Ищет рядом с метро", "С домашним животным", "Семья с ребёнком", "Студент, платит родитель", "Нужна парковка", "Работает удалённо", "Не курит", "Рассматривает тихий район", "Готов к долгому договору", None]
ARCHIVE_NOTES = ["Съехал, договор закрыт", "Переехал в другой город", "Купил своё жильё"]

rnd = random.Random(2026)


def person_name():
    last = rnd.choice(LAST_NAMES)
    if rnd.random() < 0.5:
        return f"{rnd.choice(FIRST_NAMES_M)} {last}"
    return f"{rnd.choice(FIRST_NAMES_F)} {last}а"


def random_date(start: datetime, end: datetime) -> datetime:
    return start + timedelta(seconds=rnd.random() * (end - start).total_seconds())


def make_title(label: str) -> str:
    lowered = label[0].lower() + label[1:]
    if label == "Студия":
        return rnd.choice(["Студия с евроремонтом", "Уютная студия", "Студия рядом с метро", "Светлая студия"])
    return rnd.choice(TITLE_TEMPLATES).format(r=lowered, R=label)


def split(total: int, parts: int):
    base, extra = divmod(total, parts)
    return [base + (1 if i < extra else 0) for i in range(parts)]


def main():
    conn = mysql.connector.connect(host="localhost", user="root", password="", database="realtor_db", charset="utf8mb4")
    cur = conn.cursor()
    now = datetime.now()
    year_ago = now - timedelta(days=365)
    phone_counter = rnd.randint(1000000, 1500000)

    try:
        for email, full_name in NEW_USERS:
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                print(f"Пользователь {email} уже есть — пропускаю")
                continue
            password_hash = bcrypt.hashpw(PASSWORD.encode(), bcrypt.gensalt()).decode()
            cur.execute(
                "INSERT INTO users (email, password_hash, full_name) VALUES (%s, %s, %s)",
                (email, password_hash, full_name),
            )
            print(f"Создан пользователь {email}")

        cur.execute("SELECT id, full_name FROM users ORDER BY id")
        users = cur.fetchall()
        apartments_per_user = split(APARTMENTS_TOTAL, len(users))
        tenants_per_user = split(TENANTS_TOTAL, len(users))

        for (user_id, user_name), apt_count, tenant_count in zip(users, apartments_per_user, tenants_per_user):
            occupied = min(round(apt_count * OCCUPIED_SHARE), tenant_count)

            apartments = []
            for _ in range(apt_count):
                _, label, base_price, base_area = rnd.choices(ROOM_TYPES, ROOM_WEIGHTS)[0]
                district = rnd.choice(list(DISTRICTS))
                created_at = random_date(year_ago, now - timedelta(days=3))
                trend = 1 + 0.08 * ((created_at - year_ago) / (now - year_ago))
                price = round(base_price * DISTRICTS[district] * trend * rnd.uniform(0.85, 1.15) / 500) * 500
                apartments.append({
                    "title": make_title(label),
                    "address": f"{rnd.choice(STREETS)}, д. {rnd.randint(1, 120)}, кв. {rnd.randint(1, 250)}",
                    "district": district,
                    "rooms": label,
                    "area": round(base_area * rnd.uniform(0.85, 1.15), 1),
                    "price": price,
                    "created_at": created_at,
                })

            for index in range(tenant_count):
                phone_counter += rnd.randint(1, 9000)
                digits = f"{phone_counter:07d}"
                phone = f"+7 (9{rnd.randint(10, 99)}) {digits[:3]}-{digits[3:5]}-{digits[5:]}"
                name = person_name()
                email = f"tenant{user_id}_{index + 1}@example.com" if rnd.random() < 0.8 else None

                if index < occupied:
                    apt = apartments[index]
                    status = "Заселен"
                    property_type = apt["rooms"]
                    budget = round(apt["price"] * rnd.uniform(1.0, 1.2) / 1000) * 1000
                    move_in = min(now, apt["created_at"] + timedelta(days=rnd.randint(1, 20))).date()
                    notes = rnd.choice(TENANT_NOTES)
                else:
                    _, property_type, base_price, _ = rnd.choices(ROOM_TYPES, ROOM_WEIGHTS)[0]
                    budget = round(base_price * rnd.uniform(0.8, 1.3) / 1000) * 1000
                    if rnd.random() < 0.25:
                        status = "Архив"
                        move_in = None
                        notes = rnd.choice(ARCHIVE_NOTES)
                    else:
                        status = "В поиске"
                        move_in = (now + timedelta(days=rnd.randint(5, 60))).date()
                        notes = rnd.choice(TENANT_NOTES)

                cur.execute(
                    """INSERT INTO tenants (full_name, phone, email, budget, property_type, status, move_in_date, notes, created_at, user_id)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    (name, phone, email, budget, property_type, status, move_in, notes,
                     random_date(year_ago, now - timedelta(days=1)), user_id),
                )
                if index < occupied:
                    apartments[index]["tenant_id"] = cur.lastrowid

            for apt in apartments:
                tenant_id = apt.get("tenant_id")
                cur.execute(
                    """INSERT INTO apartments (title, address, district, rooms, area_sqm, price, status, tenant_id, created_at, user_id)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    (apt["title"], apt["address"], apt["district"], apt["rooms"], apt["area"], apt["price"],
                     "Занята" if tenant_id else "Свободна", tenant_id, apt["created_at"], user_id),
                )

            print(f"{user_name}: квартир {apt_count} (занято {occupied}), жильцов {tenant_count}")

        conn.commit()
        print("Готово")
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()
