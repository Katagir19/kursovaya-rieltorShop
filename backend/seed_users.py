"""Создаёт/обновляет 5 агентов с индивидуальными паролями. Запуск из папки backend:  py seed_users.py"""
import bcrypt
import mysql.connector

USERS = [
    ("ivanov@example.com", "Агент Иванов", "Ivanov#2026"),
    ("petrov@example.com", "Агент Петров", "Petrov#2026"),
    ("sidorova@example.com", "Агент Сидорова", "Sidorova#2026"),
    ("kuznetsov@example.com", "Агент Кузнецов", "Kuznetsov#2026"),
    ("morozova@example.com", "Агент Морозова", "Morozova#2026"),
]


def main():
    conn = mysql.connector.connect(host="localhost", user="root", password="", database="realtor_db", charset="utf8mb4")
    cur = conn.cursor()
    for email, full_name, password in USERS:
        pwd_hash = bcrypt.hashpw(password.encode("utf-8")[:72], bcrypt.gensalt()).decode("utf-8")
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        row = cur.fetchone()
        if row:
            cur.execute("UPDATE users SET password_hash = %s, full_name = %s WHERE id = %s", (pwd_hash, full_name, row[0]))
        else:
            cur.execute("INSERT INTO users (email, password_hash, full_name) VALUES (%s, %s, %s)", (email, pwd_hash, full_name))
        print(f"{email} / {password}")
    conn.commit()
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
