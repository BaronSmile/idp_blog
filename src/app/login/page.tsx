'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PageTitle, AutoDismissAlert, SmallText } from '@/components/ui/Typography';

const LoginContainer = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const RegisterLink = styled.p`
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

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при входе');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <MainLayout>
      <LoginContainer>
        <Card>
          <CardHeader>
            <PageTitle>Вход в систему</PageTitle>
          </CardHeader>
          
          <CardBody>
            <AutoDismissAlert 
              type="error" 
              message={error} 
              onDismiss={clearError} 
              dismissTime={5000}
            />
            
            <form onSubmit={handleSubmit}>
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
                  placeholder="Введите ваш пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                />
              </FormGroup>
              
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Выполняется вход...' : 'Войти'}
              </Button>
            </form>
          </CardBody>
          
          <CardFooter>
            <RegisterLink>
              Нет аккаунта? <Link href="/register" style={{ color: 'inherit', textDecoration: 'none' }}>Зарегистрироваться</Link>
            </RegisterLink>
          </CardFooter>
        </Card>
      </LoginContainer>
    </MainLayout>
  );
};

export default LoginPage; 