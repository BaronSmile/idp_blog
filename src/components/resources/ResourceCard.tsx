import React from 'react';
import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export interface Resource {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  creatorName?: string;
  createdAt: string;
  updatedAt: string;
}

const ResourceCardStyled = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: ${props => props.theme.primary};
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.isDarkMode 
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'};
    border-color: ${props => props.theme.primary};
    
    &::before {
      opacity: 1;
    }
  }
  
  ${CardHeader} {
    transition: background-color 0.2s ease-in-out;
  }
  
  &:hover ${CardHeader} {
    background-color: ${props => props.theme.isDarkMode 
      ? 'rgba(96, 165, 250, 0.1)' 
      : 'rgba(59, 130, 246, 0.05)'};
  }
`;

const ResourceTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.headingColor};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-shadow: ${props => props.theme.isDarkMode ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'};
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const ResourceDescription = styled.p`
  color: ${props => props.theme.secondaryText};
  font-size: 1rem;
  margin-top: 0.5rem;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const ResourceDate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.secondaryText};
`;

const ResourceCreator = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.secondaryText};
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

interface ResourceCardProps {
  resource: Resource;
  onView: (resource: Resource) => void;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
  userId: string | null;
  userRole: string | null;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  onView, 
  onEdit, 
  onDelete,
  formatDate,
  userId,
  userRole
}) => {
  const canEdit = userRole === 'admin' || resource.createdBy === userId;
  const canDelete = userRole === 'admin' || resource.createdBy === userId;
  
  return (
    <ResourceCardStyled onClick={() => onView(resource)}>
      <CardHeader>
        <HeaderContainer>
          <TitleContainer>
            <ResourceTitle>{resource.title}</ResourceTitle>
            <ResourceCreator>
              Автор: {resource.creatorName || 'Неизвестный пользователь'}
            </ResourceCreator>
          </TitleContainer>
        </HeaderContainer>
      </CardHeader>
      
      <CardBody>
        <ResourceDescription>{resource.description}</ResourceDescription>
      </CardBody>
      
      <CardFooter>
        <ResourceDate>
          Создано: {formatDate(resource.createdAt)}
        </ResourceDate>
        <ButtonGroup>
          {canEdit && (
            <Button
              size="small"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEdit(resource);
              }}
            >
              Редактировать
            </Button>
          )}
          {canDelete && (
            <Button
              size="small"
              variant="danger"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDelete(resource._id);
              }}
            >
              Удалить
            </Button>
          )}
        </ButtonGroup>
      </CardFooter>
    </ResourceCardStyled>
  );
};

export default ResourceCard; 