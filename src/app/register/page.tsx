'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PageTitle, AutoDismissAlert } from '@/components/ui/Typography';

const RegisterContainer = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const LoginLink = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${props => props.theme.secondaryText};
  
  a {
    color: ${props => props.theme.primary} !important;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease-in-out;
    
    &:hover {
      text-decoration: underline;
      color: ${props => props.theme.isDarkMode ? '#93c5fd' : '#2563eb'} !important;
    }
  }
`;

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при регистрации');
      }

      setSuccess('Регистрация прошла успешно! Перенаправление на страницу входа...');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  return (
    <MainLayout>
      <RegisterContainer>
        <Card>
          <CardHeader>
            <PageTitle>Регистрация</PageTitle>
          </CardHeader>
          
          <CardBody>
            <AutoDismissAlert 
              type="error" 
              message={error} 
              onDismiss={clearError} 
              dismissTime={5000}
            />
            
            <AutoDismissAlert 
              type="success" 
              message={success} 
              onDismiss={clearSuccess} 
              dismissTime={3000}
            />
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  type="text"
                  label="Имя"
                  placeholder="Введите ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                />
              </FormGroup>
              
              <FormGroup>
                <Input
                  type="email"
                  label="Email"
                  placeholder="Введите ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                />
              </FormGroup>
              
              <FormGroup>
                <Input
                  type="password"
                  label="Пароль"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                />
              </FormGroup>
              
              <FormGroup>
                <Input
                  type="password"
                  label="Подтверждение пароля"
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  fullWidth
                />
              </FormGroup>
              
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </form>
          </CardBody>
          
          <CardFooter>
            <LoginLink>
              Уже есть аккаунт? <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Войти</Link>
            </LoginLink>
          </CardFooter>
        </Card>
      </RegisterContainer>
    </MainLayout>
  );
};

export default RegisterPage; 