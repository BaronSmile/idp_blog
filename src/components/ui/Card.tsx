'use client';

import styled from 'styled-components';

const Card = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  overflow: hidden;
  box-shadow: ${props => props.theme.isDarkMode 
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'};
  transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.isDarkMode 
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'};
  }
`;

const CardHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.isDarkMode 
    ? 'rgba(255, 255, 255, 0.02)' 
    : 'rgba(0, 0, 0, 0.02)'};
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.isDarkMode 
    ? 'rgba(255, 255, 255, 0.02)' 
    : 'rgba(0, 0, 0, 0.02)'};
`;

export { Card, CardHeader, CardBody, CardFooter }; 