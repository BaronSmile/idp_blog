'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Container from '../ui/Container';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

const NavbarContainer = styled.nav`
  background-color: ${props => props.theme.navBackground};
  box-shadow: ${props => props.theme.shadow};
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.isDarkMode ? props.theme.border : 'transparent'};
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.secondaryText};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  background-color: ${props => props.theme.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.theme.isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.05)'};
`;

const UserName = styled.span`
  font-weight: 500;
  color: ${props => props.theme.isDarkMode ? '#93c5fd' : props.theme.primary};
`;

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setUserRole(userData.role);
          setUserName(userData.name);
        } catch (error) {
          console.error('Ошибка при парсинге данных пользователя:', error);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
    
    if (onLogout) {
      onLogout();
    }
    
    router.push('/login');
  };

  return (
    <NavbarContainer>
      <Container>
        <NavbarContent>
          <Logo>
            <Link href="/">Blog</Link>
          </Logo>
          
          <NavLinks>
            <NavLink href="/">Главная</NavLink>
            
            {isLoggedIn ? (
              <>
                <NavLink href="/resources">Записи</NavLink>
                
                {userRole === 'admin' && (
                  <NavLink href="/admin">Админ панель</NavLink>
                )}
                
                <ThemeToggle />
                
                {userName && (
                  <UserInfo>
                    <UserName>{userName}</UserName>
                  </UserInfo>
                )}
                
                <Button size="small" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/login">Вход</NavLink>
                <NavLink href="/register">Регистрация</NavLink>
                <ThemeToggle />
              </>
            )}
          </NavLinks>
        </NavbarContent>
      </Container>
    </NavbarContainer>
  );
};

export default Navbar; 