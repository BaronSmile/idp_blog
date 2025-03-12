'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const HeroSection = styled.section`
  text-align: center;
  padding: 2rem 0 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.titleColor};
  margin-bottom: 1rem;
  text-shadow: ${props => props.theme.isDarkMode ? '0 1px 3px rgba(0, 0, 0, 0.5)' : 'none'};
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.secondaryText};
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const FeaturesSection = styled.section`
  padding: 2rem 0;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.isDarkMode 
      ? '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'};
    border-color: ${props => props.theme.primary};
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.headingColor};
  margin-bottom: 0.5rem;
  text-shadow: ${props => props.theme.isDarkMode ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.secondaryText};
  font-size: 1rem;
  line-height: 1.5;
`;

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setUserName(userData.name);
        } catch (error) {
          console.error('Ошибка при парсинге данных пользователя:', error);
        }
      }
    }
  }, []);

  return (
    <MainLayout>
      <HeroSection>
        <Title>Blog</Title>
        <Subtitle>
          Сохрани свои истории, напиши и поделись со своими единомышленниками и другими пользователями. 
          Создавай уникальный контент, который будет интересен сообществу и вдохновляй других своими идеями.
        </Subtitle>
        
        {isLoggedIn ? (
          <>
            <Title>Добро пожаловать, {userName}!</Title>
            <ButtonGroup>
              <Button as={Link} href="/resources">
                Перейти к записям
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <ButtonGroup>
            <Button as={Link} href="/register">
              Регистрация
            </Button>
            <Button as={Link} href="/login" variant="secondary">
              Вход
            </Button>
          </ButtonGroup>
        )}
      </HeroSection>
      
      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard>
            <CardBody>
              <FeatureTitle>Создавай записи</FeatureTitle>
              <FeatureDescription>
                Пиши и сохраняй свои мысли, идеи и истории в удобном формате. Редактируй и улучшай их в любое время.
              </FeatureDescription>
            </CardBody>
          </FeatureCard>
          
          <FeatureCard>
            <CardBody>
              <FeatureTitle>Управляй своим контентом</FeatureTitle>
              <FeatureDescription>
                Публикуй свои записи, редактируй их содержание или удаляй, когда это необходимо. Полный контроль над своими материалами.
              </FeatureDescription>
            </CardBody>
          </FeatureCard>
          
          <FeatureCard>
            <CardBody>
              <FeatureTitle>Безопасность</FeatureTitle>
              <FeatureDescription>
                Твои данные надежно защищены. Система авторизации обеспечивает доступ к твоим записям только для тебя и администраторов.
              </FeatureDescription>
            </CardBody>
          </FeatureCard>
          
          <FeatureCard>
            <CardBody>
              <FeatureTitle>Удобный интерфейс</FeatureTitle>
              <FeatureDescription>
                Современный и интуитивно понятный интерфейс делает создание и редактирование записей простым и приятным процессом.
              </FeatureDescription>
            </CardBody>
          </FeatureCard>
          
          <FeatureCard>
            <CardBody>
              <FeatureTitle>Доступ с любого устройства</FeatureTitle>
              <FeatureDescription>
                Создавай и просматривай записи с компьютера, планшета или смартфона — платформа адаптирована под любые экраны.
              </FeatureDescription>
            </CardBody>
          </FeatureCard>
          
          <FeatureCard>
            <CardBody>
              <FeatureTitle>Простая организация</FeatureTitle>
              <FeatureDescription>
                Все записи отсортированы по дате создания, что позволяет легко находить как новые, так и ранее созданные материалы.
              </FeatureDescription>
            </CardBody>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </MainLayout>
  );
};

export default HomePage;
