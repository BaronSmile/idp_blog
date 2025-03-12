import React, { useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { createPortal } from 'react-dom';
import Button from './Button';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 0.5rem;
  box-shadow: ${props => props.theme.isDarkMode 
    ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)' 
    : '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'};
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.3s ease-out;
  border: 1px solid ${props => props.theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : props.theme.border};
  
  @keyframes slideIn {
    from { 
      transform: translateY(20px);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    width: 95%;
  }
`;

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.02)'};
  border-bottom: 1px solid ${props => props.theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-radius: 0.5rem 0.5rem 0 0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.isDarkMode ? '#93c5fd' : props.theme.headingColor};
  text-shadow: ${props => props.theme.isDarkMode ? '0 1px 2px rgba(0, 0, 0, 0.5)' : 'none'};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${props => props.theme.secondaryText};
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.theme.textColor};
  }
  
  &:focus {
    outline: none;
    color: ${props => props.theme.primary};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  color: ${props => props.theme.isDarkMode ? '#e2e8f0' : props.theme.textColor};
  background-color: ${props => props.theme.isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'transparent'};
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  background-color: ${props => props.theme.isDarkMode ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.02)'};
  border-top: 1px solid transparent;
  border-radius: 0 0 0.5rem 0.5rem;
  background: transparent;
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'medium'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer 
        ref={modalRef}
        style={{ 
          maxWidth: size === 'small' ? '400px' : size === 'large' ? '800px' : '600px' 
        }}
      >
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <ModalBody>{children}</ModalBody>
        
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

export default Modal;
export { ModalFooter }; 