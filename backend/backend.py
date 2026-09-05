from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from typing import Optional, List
from datetime import date

app = FastAPI(title="Realtor API")

# Настройка CORS, чтобы React (localhost:3000 / 5173) мог делать запросы
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указывайте конкретный URL фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Функция подключения к MySQL в XAMPP
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",  # Стандартный юзер в XAMPP
        password="",  # По умолчанию в XAMPP пароль пустой
        database="realtor_db"
    )


# Схема валидации данных для создания жильца
class TenantCreate(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    budget: float
    property_type: str
    status: Optional[str] = "В поиске"
    move_in_date: Optional[date] = None
    notes: Optional[str] = None


# Эндпоинт: Получить список всех жильцов
@app.get("/api/tenants")
def get_tenants():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tenants ORDER BY created_at DESC")
        tenants = cursor.fetchall()
        cursor.close()
        conn.close()

        # Преобразуем типы дат в строки для корректной сериализации в JSON
        for t in tenants:
            if t.get('move_in_date'):
                t['move_in_date'] = str(t['move_in_date'])
            if t.get('created_at'):
                t['created_at'] = str(t['created_at'])

        return tenants
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")


# Эндпоинт: Добавить нового жильца
@app.post("/api/tenants")
def create_tenant(tenant: TenantCreate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO tenants (full_name, phone, email, budget, property_type, status, move_in_date, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            tenant.full_name,
            tenant.phone,
            tenant.email,
            tenant.budget,
            tenant.property_type,
            tenant.status,
            tenant.move_in_date,
            tenant.notes
        )
        cursor.execute(query, values)
        conn.commit()
        new_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Жилец успешно добавлен", "id": new_id}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")