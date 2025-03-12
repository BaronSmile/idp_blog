import React from 'react';
import styled from 'styled-components';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Resource } from './ResourceCard';

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

interface ResourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  isLoading: boolean;
  isEditing: boolean;
}

const ResourceForm: React.FC<ResourceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  isLoading,
  isEditing
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Редактировать запись' : 'Создать новую запись'}
      footer={
        <ModalFooter>
          <Button 
            type="submit" 
            form="resource-form" 
            disabled={isLoading}
          >
            {isLoading
              ? 'Сохранение...'
              : isEditing
              ? 'Обновить'
              : 'Создать'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Отмена
          </Button>
        </ModalFooter>
      }
    >
      <form 
        id="resource-form"
        onSubmit={onSubmit}
      >
        <FormGroup>
          <Input
            type="text"
            label="Заголовок"
            placeholder="Введите заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
        </FormGroup>
        
        <FormGroup>
          <Input
            as="textarea"
            label="Описание"
            placeholder="Введите описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
            style={{ minHeight: '100px' }}
          />
        </FormGroup>
      </form>
    </Modal>
  );
};

export default ResourceForm; 