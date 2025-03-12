'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import styled from 'styled-components';
import MainLayout from '@/components/layout/MainLayout';
import {Card, CardBody, CardFooter, CardHeader} from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const ResetContainer = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const Message = styled.p`
  margin: 1rem 0;
  color: #4b5563;
`;

const SuccessMessage = styled.div`
  background-color: #dcfce7;
  color: #166534;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const ResetPage = () => {
  const router = useRouter();
  const [isReset, setIsReset] = useState(false);

  const handleReset = () => {
    localStorage.clear();
    
    setIsReset(true);
    
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <MainLayout>
      <ResetContainer>
        <Card>
          <CardHeader>
            <Title>Сброс данных</Title>
          </CardHeader>
          
          <CardBody>
            <Message>
              Эта страница позволяет сбросить все данные в localStorage. 
              После сброса будет создан администратор по умолчанию.
            </Message>
            
            {isReset ? (
              <SuccessMessage>
                Данные успешно сброшены. Перенаправление на страницу входа...
              </SuccessMessage>
            ) : (
              <Button onClick={handleReset} variant="danger" fullWidth>
                Сбросить все данные
              </Button>
            )}
          </CardBody>
          
          <CardFooter>
            <Message>
              Email: admin@mail.ru<br />
              Пароль: admin123
            </Message>
          </CardFooter>
        </Card>
      </ResetContainer>
    </MainLayout>
  );
};

export default ResetPage; 