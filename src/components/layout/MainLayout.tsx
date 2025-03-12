'use client';

import styled from 'styled-components';
import Navbar from './Navbar';
import Container from '../ui/Container';

const Main = styled.main`
  min-height: calc(100vh - 64px);
  padding: 2rem 0;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Main>
        <Container>{children}</Container>
      </Main>
    </>
  );
};

export default MainLayout; 