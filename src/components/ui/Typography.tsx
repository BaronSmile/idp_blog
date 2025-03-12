'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Заголовки
const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.titleColor};
  text-shadow: ${props => props.theme.isDarkMode ? '0 1px 3px rgba(0, 0, 0, 0.5)' : 'none'};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.headingColor};
  text-shadow: ${props => props.theme.isDarkMode ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'};
`;

const SmallText = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.secondaryText};
`;

const AlertBase = styled.div<{ $type?: 'success' | 'error' | 'info' | 'warning' }>`
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  
  ${props => {
    switch (props.$type) {
      case 'success':
        return `
          background-color: ${props.theme.isDarkMode ? '#1c4532' : '#dcfce7'};
          color: ${props.theme.isDarkMode ? '#6ee7b7' : '#166534'};
        `;
      case 'error':
        return `
          background-color: ${props.theme.isDarkMode ? '#4c1d1d' : '#fee2e2'};
          color: ${props.theme.isDarkMode ? '#f87171' : '#b91c1c'};
        `;
      case 'warning':
        return `
          background-color: ${props.theme.isDarkMode ? '#713f12' : '#fef3c7'};
          color: ${props.theme.isDarkMode ? '#fbbf24' : '#92400e'};
        `;
      case 'info':
      default:
        return `
          background-color: ${props.theme.isDarkMode ? '#1e3a8a' : '#dbeafe'};
          color: ${props.theme.isDarkMode ? '#60a5fa' : '#1e40af'};
        `;
    }
  }}
`;

interface AutoDismissAlertProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string | null;
  onDismiss: () => void;
  dismissTime?: number;
}

const AlertContainer = styled(AlertBase)<{ $isVisible: boolean }>`
  position: relative;
  padding-right: 2.5rem;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(-20px)'};
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.secondaryText};
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.textColor};
  }
`;

const AutoDismissAlert: React.FC<AutoDismissAlertProps> = ({ 
  type = 'info', 
  message, 
  onDismiss,
  dismissTime = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        
        setTimeout(() => {
          onDismiss();
        }, 500);
      }, dismissTime);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [message, dismissTime, onDismiss]);
  
  if (!message) return null;
  
  return (
    <AlertContainer $type={type} $isVisible={isVisible}>
      {message}
      <CloseButton onClick={() => setIsVisible(false)}>
        &times;
      </CloseButton>
    </AlertContainer>
  );
};

// // Ссылки
// const StyledLink = styled.a`
//   color: ${props => props.theme.primary};
//   text-decoration: none;
//   transition: color 0.2s ease-in-out;
//
//   &:hover {
//     color: ${props => props.theme.isDarkMode ? '#93c5fd' : '#2563eb'};
//     text-decoration: underline;
//   }
// `;

export { 
  PageTitle, 
  SectionTitle,
  SmallText, 
  AutoDismissAlert,
  // StyledLink
};