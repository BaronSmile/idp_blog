'use client';

import styled from 'styled-components';

interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger';
  $size?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
  fullWidth?: boolean;
}

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: none;
  
  padding: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '0.5rem 1rem';
      case 'large':
        return '0.75rem 1.5rem';
      default:
        return '0.625rem 1.25rem';
    }
  }};
  
  font-size: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '0.875rem';
      case 'large':
        return '1.125rem';
      default:
        return '1rem';
    }
  }};
  
  width: ${(props) => (props.$fullWidth || props.fullWidth ? '100%' : 'auto')};
  
  background-color: ${(props) => {
    switch (props.$variant) {
      case 'secondary':
        return props.theme.secondary;
      case 'danger':
        return props.theme.danger;
      default:
        return props.theme.primary;
    }
  }};
  
  color: ${(props) => {
    switch (props.$variant) {
      case 'secondary':
        return props.theme.text;
      default:
        return props.theme.isDarkMode ? '#000000' : '#ffffff';
    }
  }};
  
  &:hover {
    background-color: ${(props) => {
      switch (props.$variant) {
        case 'secondary':
          return props.theme.hoverBackground;
        case 'danger':
          return props.theme.isDarkMode ? '#ef5350' : '#dc2626';
        default:
          return props.theme.isDarkMode ? '#93c5fd' : '#2563eb';
      }
    }};
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${(props) => {
      switch (props.$variant) {
        case 'secondary':
          return 'rgba(229, 231, 235, 0.5)';
        case 'danger':
          return 'rgba(239, 68, 68, 0.5)';
        default:
          return 'rgba(59, 130, 246, 0.5)';
      }
    }};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

Button.defaultProps = {
  $variant: 'primary',
  $size: 'medium',
  $fullWidth: false,
};

const ButtonWrapper = ({ variant, size, fullWidth, ...props }: any) => {
  return <Button $variant={variant} $size={size} $fullWidth={fullWidth} {...props} />;
};

export default ButtonWrapper; 