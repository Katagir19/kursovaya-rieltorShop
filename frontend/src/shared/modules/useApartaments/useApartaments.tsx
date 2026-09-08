import { useState, useEffect } from 'react';

export interface Apartaments {
  title: string;
  id: number;
  address: string;
  rooms: string;
  price: number;
  status: string;
  tenant_id: string;
  created_at: string;
}

export type CreateApartamentsInput = Omit<Apartaments, 'id' | 'created_at'>;

const API_URL = 'http://127.0.0.1:8000/api/apartments';

export const useApartaments = () => {
  const [apartaments, setApartaments] = useState<Apartaments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchApartamentInfo = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Error status: ${response.status}`);
        }
        const data = await response.json();

        const newApartaments: Apartaments[] = data.map((item: any) => ({
          title: item.title,
          id: item.id,
          address: item.address,           
          rooms: item.rooms,               
          price: Number(item.price || 0),  
          status: item.status,             
          tenant_id: item.tenant_id || '', 
          created_at: item.created_at,
        }));

        if (!isCancelled) setApartaments(newApartaments);
      } catch (err: any) {
        if (!isCancelled) setError(err.message);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchApartamentInfo();

    return () => {
      isCancelled = true;
    };
  }, []);

  const addApartament = async (apartamentData: CreateApartamentsInput) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apartamentData),
    });

    if (!response.ok) {
      throw new Error(`Не удалось добавить апартаменты (код ${response.status})`);
    }

    const resJson = await response.json();

    const newApartament: Apartaments = {
      title: resJson.title,
      id: resJson.id,
      address: resJson.full_name || apartamentData.address,
      rooms: resJson.email || apartamentData.rooms || '',
      price: Number(resJson.budget ?? apartamentData.price ?? 0),
      status: resJson.move_in_date || apartamentData.status || '',
      tenant_id: resJson.notes || apartamentData.tenant_id || '',
      created_at: resJson.created_at || new Date().toISOString(),
    };

    setApartaments((prev) => [newApartament, ...prev]);
  } catch (err: any) {
    console.error('Ошибка при добавлении:', err);
    setError(err.message);
    throw err;
  }
};

  const deleteApartament = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Ошибка удаления (код ${response.status})`);
      }

      setApartaments((prev) => prev.filter((apartament) => apartament.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { apartaments, isLoading, error, addApartament, deleteApartament };
};
