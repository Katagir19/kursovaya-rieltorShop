import { useEffect, useState } from 'react';
import { apartmentsService } from '../../services/apartmentsService';
import type { Apartaments, CreateApartamentsInput } from '../../types/apartment';

export type { Apartaments, CreateApartamentsInput } from '../../types/apartment';

const getMessage = (err: unknown) => (err instanceof Error ? err.message : 'Неизвестная ошибка');

export const useApartaments = () => {
  const [apartaments, setApartaments] = useState<Apartaments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    apartmentsService
      .getAll()
      .then((data) => {
        if (!isCancelled) setApartaments(data);
      })
      .catch((err) => {
        if (!isCancelled) setError(getMessage(err));
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const addApartament = async (apartamentData: CreateApartamentsInput) => {
    try {
      const { id } = await apartmentsService.create(apartamentData);
      const newApartament: Apartaments = {
        ...apartamentData,
        id,
        price: Number(apartamentData.price || 0),
        tenant_id: apartamentData.tenant_id || '',
        created_at: new Date().toISOString(),
      };
      setApartaments((prev) => [newApartament, ...prev]);
    } catch (err) {
      setError(getMessage(err));
      throw err;
    }
  };

  const deleteApartament = async (id: number) => {
    try {
      await apartmentsService.remove(id);
      setApartaments((prev) => prev.filter((apartament) => apartament.id !== id));
    } catch (err) {
      setError(getMessage(err));
      throw err;
    }
  };

  return { apartaments, isLoading, error, addApartament, deleteApartament };
};
