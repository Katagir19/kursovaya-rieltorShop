import React, { useState } from 'react';
import type { CreateApartamentsInput } from '../../../shared/modules/useApartaments/useApartaments';
import {
  Overlay,
  Modal,
  Form,
  FormGroup,
  Actions,
  AddButton,
  SecondaryButton,
} from '../../../../src/pages/Apartments/style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apartment: CreateApartamentsInput) => Promise<void>;
}

export const AddApartmentModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [formData, setFormData] = useState<CreateApartamentsInput>({
    title: '',
    address: '',
    rooms: '',
    price: 0,
    status: 'Свободна',
    tenant_id: '',
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      // Сброс формы после успешной отправки
      setFormData({
        title: '',
        address: '',
        rooms: '',
        price: 0,
        status: 'Свободна',
        tenant_id: '',
      });
      onClose();
    } catch (err) {
      console.error('Не удалось добавить апартаменты:', err);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={handleSubmit}>
          <h2>Добавить апартаменты</h2>

          <FormGroup>
            <label>Название / Описание</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Уютная 2-комнатная квартира"
            />
          </FormGroup>

          <FormGroup>
            <label>Адрес</label>
            <input
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="пр. Кирова, д. 10, кв. 88"
            />
          </FormGroup>

          <FormGroup>
            <label>Комнаты / Площадь</label>
            <input
              required
              type="text"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              placeholder="2-комнатная квартира"
            />
          </FormGroup>

          <FormGroup>
            <label>Цена (₽ / мес)</label>
            <input
              required
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="45000"
            />
          </FormGroup>

          <FormGroup>
            <label>Статус недвижимости</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Свободна">Свободна</option>
              <option value="Занята">Занята</option>
            </select>
          </FormGroup>

          <Actions>
            <SecondaryButton type="button" onClick={onClose}>
              Отмена
            </SecondaryButton>
            <AddButton type="submit">Сохранить</AddButton>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
};