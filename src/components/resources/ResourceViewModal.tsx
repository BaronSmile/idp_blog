import React from 'react';
import styled from 'styled-components';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Resource } from './ResourceCard';

const ResourceViewContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.isDarkMode ? '#e2e8f0' : props.theme.textColor};
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
  padding: 0.5rem;
  background-color: ${props => props.theme.isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'transparent'};
  border-radius: 0.375rem;
`;

const ResourceViewMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.isDarkMode ? '#cbd5e1' : props.theme.secondaryText};
  border-top: 1px solid ${props => props.theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : props.theme.border};
  padding-top: 1rem;
  margin-top: 1rem;
`;

const ResourceViewDate = styled.div`
  strong {
    font-weight: 600;
    color: ${props => props.theme.isDarkMode ? '#93c5fd' : props.theme.headingColor};
  }
`;

interface ResourceViewModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (resource: Resource) => void;
  formatDate: (dateString: string) => string;
  userId: string | null;
  userRole: string | null;
}

const ResourceViewModal: React.FC<ResourceViewModalProps> = ({
  resource,
  isOpen,
  onClose,
  onEdit,
  formatDate,
  userId,
  userRole
}) => {
  if (!resource) return null;
  
  const canEdit = userRole === 'admin' || resource.createdBy === userId;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={resource.title}
      footer={
        <ModalFooter>
          {canEdit && (
            <Button
              type="button"
              onClick={() => {
                onClose();
                onEdit(resource);
              }}
            >
              Редактировать
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Закрыть
          </Button>
        </ModalFooter>
      }
    >
      <div>
        <ResourceViewContent>
          {resource.description}
        </ResourceViewContent>
        <ResourceViewMeta>
          <ResourceViewDate>
            <strong>Создано:</strong> {formatDate(resource.createdAt)}
          </ResourceViewDate>
          {resource.updatedAt !== resource.createdAt && (
            <ResourceViewDate>
              <strong>Обновлено:</strong> {formatDate(resource.updatedAt)}
            </ResourceViewDate>
          )}
        </ResourceViewMeta>
      </div>
    </Modal>
  );
};

export default ResourceViewModal; 