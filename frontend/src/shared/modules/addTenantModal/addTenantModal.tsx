import React, { useState } from 'react';
import type { CreateTenantInput } from '../../../shared/modules/useTenant/useTenants';
import {
  Overlay,
  Modal,
  Form,
  FormGroup,
  Actions,
  AddButton,
  SecondaryButton,
} from '../../../../src/pages/Tenants/style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tenant: CreateTenantInput) => Promise<void>;
}

export const AddTenantModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [formData, setFormData] = useState<CreateTenantInput>({
    full_name: '',
    phone: '',
    email: '',
    budget: 0,
    property_type: '1-комнатная квартира',
    move_in_date: new Date().toISOString().split('T')[0],
    status: 'В поиске',
    notes: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); 
  
  try {
    await onSubmit(formData);
    onClose();
  } catch (err) {
    console.error('Не удалось добавить жильца:', err);
  }
};

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={handleSubmit}>
          <h2>Добавить жильца</h2>

          <FormGroup>
            <label>ФИО</label>
            <input required name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Иван Иванов" />
          </FormGroup>

          <FormGroup>
            <label>Телефон</label>
            <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="+7 (999) 000-00-00" />
          </FormGroup>

          <FormGroup>
            <label>Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" />
          </FormGroup>

          <FormGroup>
            <label>Бюджет (₽)</label>
            <input required type="number" name="budget" value={formData.budget || ''} onChange={handleChange} placeholder="45000" />
          </FormGroup>

          <FormGroup>
            <label>Тип недвижимости</label>
            <input name="property_type" value={formData.property_type} onChange={handleChange} placeholder="1-комнатная квартира" />
          </FormGroup>

          <FormGroup>
            <label>Дата заселения</label>
            <input type="date" name="move_in_date" value={formData.move_in_date} onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <label>Статус</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="В поиске">В поиске</option>
              <option value="Заселен">Заселен</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label>Заметки</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Особые пожелания..." />
          </FormGroup>

          <Actions>
            <SecondaryButton type="button" onClick={onClose}>Отмена</SecondaryButton>
            <AddButton type="submit">Сохранить</AddButton>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
};
