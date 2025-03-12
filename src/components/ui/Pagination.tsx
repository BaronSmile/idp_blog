'use client';

import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.25rem;
  padding: 0 0.75rem;
  border-radius: 0.375rem;
  background-color: ${(props) => 
    props.$isActive 
      ? props.theme.primary 
      : props.theme.cardBackground
  };
  color: ${(props) => 
    props.$isActive 
      ? (props.theme.isDarkMode ? '#000000' : '#ffffff')
      : props.theme.textColor
  };
  border: 1px solid ${(props) => 
    props.$isActive 
      ? props.theme.primary 
      : props.theme.border
  };
  cursor: ${(props) => (props.$isActive ? 'default' : 'pointer')};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
   color: ${props => props.theme.isDarkMode ? '#fff' : '#111'};
  
  &:hover {
    background-color: ${(props) => 
      props.$isActive 
        ? props.theme.primary 
        : props.theme.hoverBackground
    };
    transform: ${(props) => (props.$isActive ? 'none' : 'translateY(-2px)')};
    box-shadow: ${(props) => 
      props.$isActive 
        ? 'none' 
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    };
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    color: ${props => props.theme.isDarkMode ? '#fff' : '#111'};
  }
  
  @media (max-width: 640px) {
    min-width: 2rem;
    height: 2rem;
    margin: 0 0.125rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.25rem;
  color: ${(props) => props.theme.textColor};
  font-size: 1rem;
  
  @media (max-width: 640px) {
    min-width: 1.5rem;
    font-size: 0.875rem;
  }
`;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  if (totalPages <= 1) {
    return null;
  }
  
  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  
  const generatePaginationItems = () => {
    const totalPageNumbers = siblingCount * 2 + 5;
    
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
    
    const firstPageIndex = 1;
    const lastPageIndex = totalPages;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      
      return [...leftRange, '...', totalPages];
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      
      return [firstPageIndex, '...', ...rightRange];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }
  };
  
  const paginationItems = generatePaginationItems();
  
  return (
    <PaginationContainer>
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Назад
      </PaginationButton>
      
      {paginationItems?.map((item, index) => {
        if (item === '...') {
          return <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>;
        }
        
        return (
          <PaginationButton
            key={`page-${item}`}
            $isActive={currentPage === item}
            onClick={() => onPageChange(Number(item))}
          >
            {item}
          </PaginationButton>
        );
      })}
      
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Вперед
      </PaginationButton>
    </PaginationContainer>
  );
};

export default Pagination; 