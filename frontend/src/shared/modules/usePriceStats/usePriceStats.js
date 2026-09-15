import { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:8000/api/apartments/price-stats';

export const usePriceStats = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchStats = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error status: ${response.status}`);
        const data = await response.json();
        if (!isCancelled) setGroups(data.groups ?? []);
      } catch (err) {
        if (!isCancelled) setError(err.message);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchStats();
    return () => { isCancelled = true; };
  }, []);

  return { groups, isLoading, error };
};
