'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import styled from 'styled-components';
import MainLayout from '@/components/layout/MainLayout';
import {Card, CardBody, CardHeader} from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import {AutoDismissAlert, PageTitle, SectionTitle} from '@/components/ui/Typography';

const AdminContainer = styled.div`
    padding: 1rem 0;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1.5rem;
`;

const Subtitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 2rem 0 1rem;
`;

const UsersTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
`;

const TableHeader = styled.th`
    text-align: left;
    padding: 0.75rem;
    border-bottom: 1px solid ${props => props.theme.border};
    color: ${props => props.theme.secondaryText};
    font-weight: 600;
`;

const TableCell = styled.td`
    padding: 0.75rem;
    border-bottom: 1px solid ${props => props.theme.border};
`;

const TableRow = styled.tr`
    &:hover {
        background-color: ${props => props.theme.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb'};
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
`;

const Badge = styled.span<{ $role: 'user' | 'admin' }>`
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    background-color: ${(props) =>
            props.$role === 'admin' ? props.theme.primary : props.theme.secondaryBackground};
    color: ${(props) =>
            props.$role === 'admin' ? '#ffffff' : props.theme.textColor};
`;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

const AdminPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [formLoading, setFormLoading] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);

        if (userData.role !== 'admin') {
          router.push('/');
          return;
        }

        setCurrentUserId(userData.id);
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя:', error);
        router.push('/');
        return;
      }
    }

    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке пользователей');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({name, email, password, role: 'user'}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании пользователя');
      }

      setSuccess('Пользователь успешно создан');
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setIsModalOpen(false);

      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setFormLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({name, email}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при обновлении пользователя');
      }

      setSuccess('Пользователь успешно обновлен');
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setIsModalOpen(false);
      setEditingUser(null);

      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUserId) {
      setError('Вы не можете удалить свою учетную запись');
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при удалении пользователя');
      }

      setSuccess('Пользователь успешно удален');

      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setRole(user.role);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <MainLayout>
      <AdminContainer>
        <PageTitle>Панель администратора</PageTitle>

        <AutoDismissAlert
          type="error"
          message={error}
          onDismiss={() => setError(null)}
          dismissTime={5000}
        />

        <AutoDismissAlert
          type="success"
          message={success}
          onDismiss={() => setSuccess(null)}
          dismissTime={3000}
        />

        <SectionTitle>Управление пользователями</SectionTitle>

        <Button onClick={() => setIsModalOpen(true)}>
          Создать нового пользователя
        </Button>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingUser ? 'Редактировать пользователя' : 'Создать нового пользователя'}
        >
          <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
            <FormGroup>
              <Input
                type="text"
                label="Имя"
                placeholder="Введите имя"
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
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </FormGroup>

            {!editingUser && (
              <FormGroup>
                <Input
                  type="password"
                  label="Пароль"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingUser}
                  fullWidth
                />
              </FormGroup>
            )}

            <ModalFooter>
              <Button type="submit" disabled={formLoading}>
                {formLoading
                  ? 'Сохранение...'
                  : editingUser
                    ? 'Обновить'
                    : 'Создать'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
              >
                Отмена
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {isLoading ? (
          <p>Загрузка пользователей...</p>
        ) : (
          <UsersTable>
            <thead>
              <tr>
                <TableHeader>Имя</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Роль</TableHeader>
                <TableHeader>Дата регистрации</TableHeader>
                <TableHeader>Действия</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge $role={user.role}>
                      {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <Button
                        size="small"
                        onClick={() => handleEditClick(user)}
                      >
                        Редактировать
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user._id === currentUserId}
                      >
                        Удалить
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </UsersTable>
        )}
      </AdminContainer>
    </MainLayout>
  );
};

export default AdminPage; 