from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from typing import Optional, List
from datetime import date

app = FastAPI(title="Realtor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указывайте конкретный URL фронтенда  Посмтореть!
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


class TenantCreate(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    budget: float
    property_type: str
    status: Optional[str] = "В поиске"
    move_in_date: Optional[date] = None
    notes: Optional[str] = None

class ApartmantCreate(BaseModel):
    title: str
    address: str
    rooms: str
    price: float
    status: Optional[str] = "Свободна"
    tenant_id: Optional[int] = None

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

# Эндпоинт: Удалить жильца по ID из БД
@app.delete("/api/tenants/{tenant_id}")
def delete_tenant(tenant_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Проверяем, существует ли жилец с таким ID
        cursor.execute("SELECT id FROM tenants WHERE id = %s", (tenant_id,))
        tenant = cursor.fetchone()
        
        if not tenant:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Жилец не найден в базе данных")
            
        # Удаляем запись из MySQL
        cursor.execute("DELETE FROM tenants WHERE id = %s", (tenant_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {"message": "Жилец успешно удален", "id": tenant_id}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")

#Эндпоинт: Получить список всех апартамент
@app.get("/api/apartments")
def get_apartaments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            '''SELECT a.*, t.full_name AS tenant_name 
            FROM apartments a 
            LEFT JOIN tenants t ON a.tenant_id = t.id 
            ORDER BY a.id DESC'''
            )
        apartaments = cursor.fetchall()
        cursor.close()
        conn.close()

        # Преобразуем типы дат в строки для корректной сериализации в JSON
        for a in apartaments:
            if a.get('move_in_date'):
                a['move_in_date'] = str(a['move_in_date'])
            if a.get('created_at'):
                a['created_at'] = str(a['created_at'])

        return apartaments
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")

# Эндпоинт: Добавить новые аппартаменты
@app.post("/api/apartments")
def create_apartament(apartament: ApartmantCreate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO apartments (title, address, rooms, price, status, tenant_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            apartament.title,
            apartament.address,
            apartament.rooms,
            apartament.price,
            apartament.status,
            apartament.tenant_id,
        )
        cursor.execute(query, values)
        conn.commit()
        apt_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Апартаменты успешно добавлены", "id": apt_id}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")

# Эндпоинт: Удалить аппартаменты из БД по ID
@app.delete("/api/apartments/{apartament_id}")
def delete_apartament(apartament_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Проверяем, существует ли апартаменты с таким ID
        cursor.execute("SELECT id FROM apartaments WHERE id = %s", (apartament_id,))
        tenant = cursor.fetchone()
        
        if not tenant:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Апартаменты не найдены в базе данных")
            
        # Удаляем запись из MySQL
        cursor.execute("DELETE FROM apartaments WHERE id = %s", (apartament_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {"message": "Апартаменты успешно удалены", "id": apartament_id}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
