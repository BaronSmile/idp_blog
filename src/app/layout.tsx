import './globals.css';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/registry';
import { ThemeProvider } from '@/lib/ThemeContext';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'Blog',
  description: 'Приложение с авторизацией и API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
