'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface StyledInputProps {
  $hasError?: boolean;
  $fullWidth?: boolean;
}

const InputContainer = styled.div<{ $fullWidth?: boolean }>`
  margin-bottom: 1rem;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.labelColor};
`;

const StyledInput = styled.input<StyledInputProps>`
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.inputBackground};
  border: 1px solid ${(props) =>
    props.$hasError ? props.theme.danger : props.theme.inputBorder};
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$hasError ? props.theme.danger : props.theme.primary};
    box-shadow: 0 0 0 3px ${(props) =>
      props.$hasError
        ? 'rgba(239, 68, 68, 0.25)'
        : 'rgba(59, 130, 246, 0.25)'};
  }
  
  &::placeholder {
    color: ${(props) => props.theme.placeholderColor};
  }
  
  &:disabled {
    background-color: ${(props) => props.theme.disabledBackground};
    cursor: not-allowed;
  }
`;

const StyledTextarea = styled.textarea<StyledInputProps>`
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.inputBackground};
  border: 1px solid ${(props) =>
    props.$hasError ? props.theme.danger : props.theme.inputBorder};
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$hasError ? props.theme.danger : props.theme.primary};
    box-shadow: 0 0 0 3px ${(props) =>
      props.$hasError
        ? 'rgba(239, 68, 68, 0.25)'
        : 'rgba(59, 130, 246, 0.25)'};
  }
  
  &::placeholder {
    color: ${(props) => props.theme.placeholderColor};
  }
  
  &:disabled {
    background-color: ${(props) => props.theme.disabledBackground};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.danger};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const HelperText = styled.div`
  color: ${(props) => props.theme.secondaryText};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  as?: 'input' | 'textarea';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      as = 'input',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    
    const inputProps = {
      $hasError: hasError,
      $fullWidth: fullWidth,
      ...props,
    };
    
    return (
      <InputContainer $fullWidth={fullWidth}>
        {label && <InputLabel>{label}</InputLabel>}
        
        {as === 'textarea' ? (
          <StyledTextarea 
            $hasError={hasError}
            $fullWidth={fullWidth}
            {...props as any}
          />
        ) : (
          <StyledInput {...inputProps} ref={ref} />
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {helperText && !error && <HelperText>{helperText}</HelperText>}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';

export default Input; 