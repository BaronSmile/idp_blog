import React from 'react';
import styled from 'styled-components';
import Pagination from '@/components/ui/Pagination';

const PaginationInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PaginationInfo = styled.div`
  background-color: ${props => props.theme.isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'};
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: ${props => props.theme.secondaryText};
  border: 1px solid ${props => props.theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PageSizeSelect = styled.select`
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.theme.isDarkMode 
    ? props.theme.border 
    : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const PageSizeLabel = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.secondaryText};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface ResourcePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  paginationInfo: string;
}

const ResourcePagination: React.FC<ResourcePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onPageSizeChange,
  paginationInfo
}) => {
  if (totalPages <= 0) return null;
  
  return (
    <>
      <PaginationInfoContainer>
        <PaginationInfo>
          {paginationInfo}
        </PaginationInfo>
        
        <PaginationControls>
          <PageSizeLabel>
            Записей на странице:
            <PageSizeSelect 
              value={itemsPerPage} 
              onChange={onPageSizeChange}
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </PageSizeSelect>
          </PageSizeLabel>
        </PaginationControls>
      </PaginationInfoContainer>
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default ResourcePagination; 