import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const slideIn = keyframes`
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(120%);
    opacity: 0;
  }
`;

const getToastColor = (type: ToastType, isDarkMode: boolean) => {
  switch (type) {
    case 'success':
      return isDarkMode ? '#10B981' : '#059669';
    case 'error':
      return isDarkMode ? '#EF4444' : '#DC2626';
    case 'warning':
      return isDarkMode ? '#F59E0B' : '#D97706';
    case 'info':
    default:
      return isDarkMode ? '#3B82F6' : '#2563EB';
  }
};

const getToastBackground = (type: ToastType, isDarkMode: boolean) => {
  switch (type) {
    case 'success':
      return isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)';
    case 'error':
      return isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)';
    case 'warning':
      return isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(217, 119, 6, 0.1)';
    case 'info':
    default:
      return isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)';
  }
};

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
    default:
      return 'ℹ';
  }
};

const ToastContainer = styled.div<{ 
  $type: ToastType; 
  $isExiting: boolean; 
  $position: string;
}>`
  position: fixed;
  ${props => {
    switch (props.$position) {
      case 'top-left':
        return 'top: 4rem; left: 1rem;';
      case 'bottom-right':
        return 'bottom: 1rem; right: 1rem;';
      case 'bottom-left':
        return 'bottom: 1rem; left: 1rem;';
      case 'top-right':
      default:
        return 'top: 4rem; right: 1rem;';
    }
  }}
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${props => getToastBackground(props.$type, props.theme.isDarkMode)};
  border-left: 4px solid ${props => getToastColor(props.$type, props.theme.isDarkMode)};
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  min-width: 300px;
  max-width: 450px;
  animation: ${props => props.$isExiting ? css`${slideOut} 0.3s ease-out forwards` : css`${slideIn} 0.3s ease-out forwards`};
`;

const IconContainer = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => getToastColor(props.$type, props.theme.isDarkMode)};
  color: white;
  margin-right: 0.75rem;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const MessageContainer = styled.div`
  flex-grow: 1;
  color: ${props => props.theme.textColor};
  font-size: 0.875rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.secondaryText};
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.75rem;
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.theme.textColor};
  }
`;

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  duration = 5000,
  onClose,
  position = 'top-right'
}) => {
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);
    
    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };
  
  return (
    <ToastContainer $type={type} $isExiting={isExiting} $position={position}>
      <IconContainer $type={type}>
        {getToastIcon(type)}
      </IconContainer>
      <MessageContainer>
        {message}
      </MessageContainer>
      <CloseButton onClick={handleClose}>
        &times;
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast;

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface ToastManagerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export const ToastManager: React.FC<ToastManagerProps> = ({ toasts, removeToast }) => {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const addToast = (
    type: ToastType,
    message: string,
    duration = 5000,
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, type, message, duration, position }]);
    return id;
  };
  
  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };
  
  const toast = {
    success: (message: string, duration?: number, position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => 
      addToast('success', message, duration, position),
    error: (message: string, duration?: number, position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => 
      addToast('error', message, duration, position),
    warning: (message: string, duration?: number, position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => 
      addToast('warning', message, duration, position),
    info: (message: string, duration?: number, position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => 
      addToast('info', message, duration, position),
  };
  
  return { toasts, toast, removeToast };
}; 