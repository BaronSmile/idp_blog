import React from 'react';
import styled from 'styled-components';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const DeleteConfirmText = styled.p`
  text-align: center;
  margin: 0.5rem 0 1.5rem;
  color: ${props => props.theme.textColor};
  font-size: 1rem;
  line-height: 1.5;
`;

const DeleteButton = styled(Button)`
  min-width: 100px;
  background-color: ${props => props.theme.danger};
  
  &:hover {
    background-color: ${props => props.theme.isDarkMode ? '#ef5350' : '#dc2626'};
  }
`;

const CancelButton = styled(Button)`
  min-width: 100px;
`;

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Подтверждение удаления"
      size="small"
      footer={
        <ModalFooter>
          <DeleteButton
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Удаление...' : 'Удалить'}
          </DeleteButton>
          <CancelButton
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Отмена
          </CancelButton>
        </ModalFooter>
      }
    >
      <DeleteConfirmText>
        Вы уверены, что хотите удалить эту запись?
        <br />
        Это действие нельзя отменить.
      </DeleteConfirmText>
    </Modal>
  );
};

export default DeleteConfirmModal; 