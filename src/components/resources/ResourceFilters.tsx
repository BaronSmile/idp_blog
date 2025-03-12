import React from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SearchContainer = styled.div`
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.textColor};
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
  
  &::placeholder {
    color: ${props => props.theme.secondaryText};
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SortLabel = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.secondaryText};
`;

const SortSelect = styled.select`
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.textColor};
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

interface ResourceFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortBy: SortOption;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCreateClick: () => void;
  hasResources: boolean;
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onCreateClick,
  hasResources
}) => {
  return (
    <FiltersContainer>
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="Поиск по заголовку или содержанию..." 
          value={searchTerm}
          onChange={onSearchChange}
        />
      </SearchContainer>
      
      <ControlsContainer>
        <Button onClick={onCreateClick}>
          Создать новую запись
        </Button>
        
        {hasResources && (
          <SortContainer>
            <SortLabel htmlFor="sort-select">Сортировать по:</SortLabel>
            <SortSelect 
              id="sort-select" 
              value={sortBy} 
              onChange={onSortChange}
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="title-asc">По названию (А-Я)</option>
              <option value="title-desc">По названию (Я-А)</option>
            </SortSelect>
          </SortContainer>
        )}
      </ControlsContainer>
    </FiltersContainer>
  );
};

export default ResourceFilters; 