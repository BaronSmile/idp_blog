import React from 'react';
import styled from 'styled-components';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal, { ModalFooter } from '@/components/ui/Modal';

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

interface ResourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isEditing: boolean;
}

const ResourceForm: React.FC<ResourceFormProps> = ({
  isOpen,
  onClose,
  title,
  description,
  setTitle,
  setDescription,
  onSubmit,
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