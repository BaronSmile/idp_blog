'use client';

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@/lib/ThemeContext';

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.secondaryText};
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    color: ${props => props.theme.primary};
    background-color: ${props => props.theme.hoverBackground};
  }
`;

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <ToggleButton onClick={toggleTheme} aria-label="Переключить тему">
      {isDarkMode ? (
        //light mode icon
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        // dark mode icon
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </ToggleButton>
  );
};

export default ThemeToggle; 