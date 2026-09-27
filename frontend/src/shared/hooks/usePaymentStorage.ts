import { useState, useEffect } from 'react';

const STORAGE_PREFIX = 'payment_paid_amount_';

export const usePaymentStorage = (paymentId: string | number, initialValue: number = 0) => {
  const key = `${STORAGE_PREFIX}${paymentId}`;

  const [paidAmount, setPaidAmount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        const parsed = Number(saved);
        return Number.isNaN(parsed) ? initialValue : parsed;
      }
    } catch (error) {
      console.error('Ошибка чтения из localStorage:', error);
    }
    return initialValue;
  });

  const updatePaidAmount = (newAmount: number) => {
    setPaidAmount(newAmount);
    try {
      localStorage.setItem(key, String(newAmount));
    } catch (error) {
      console.error('Ошибка записи в localStorage:', error);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        setPaidAmount(Number(saved));
      } else {
        setPaidAmount(initialValue);
      }
    } catch (error) {
      console.error('Ошибка обновления при смене ID:', error);
    }
  }, [key, initialValue]);

  return [paidAmount, updatePaidAmount] as const;
};
