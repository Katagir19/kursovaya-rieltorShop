export interface Payment {
  id: number;               // ID квартиры/платежа
  apartment_id: number;
  apartment_title: string;
  address: string;
  price: number;
  tenant_id: string | number;
  tenant_name: string;
  tenant_phone: string;
  tenant_email: string;
  created_at: string;       // Дата заселения / создания
  due_date: string;         // Срок истечения платежа (создание + 1 месяц)
  paid_amount?: number;
}
