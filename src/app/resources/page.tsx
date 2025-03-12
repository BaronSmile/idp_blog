'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import MainLayout from '@/components/layout/MainLayout';
import { ToastManager, useToast } from '@/components/ui/Toast';
import ResourceCard, { Resource } from '@/components/resources/ResourceCard';
import ResourceViewModal from '@/components/resources/ResourceViewModal';
import DeleteConfirmModal from '@/components/resources/DeleteConfirmModal';
import ResourceForm from '@/components/resources/ResourceForm';
import ResourceFilters, { SortOption } from '@/components/resources/ResourceFilters';
import ResourcePagination from '@/components/resources/ResourcePagination';

const ResourcesContainer = styled.div`
  padding: 1rem 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.titleColor};
  margin-bottom: 1.5rem;
  text-shadow: ${props => props.theme.isDarkMode ? '0 1px 3px rgba(0, 0, 0, 0.5)' : 'none'};
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const NoResourcesMessage = styled.p`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.secondaryText};
  font-size: 1.125rem;
  background-color: ${props => props.theme.isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 0.5rem;
  border: 1px dashed ${props => props.theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  margin-top: 2rem;
`;

const ResourcesPage: React.FC = () => {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  
  const { toasts, toast, removeToast } = useToast();

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
        setUserId(userData.id);
        setUserRole(userData.role);
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя:', error);
      }
    }

    fetchResources();
  }, [router]);

  const fetchResources = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/resources', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при загрузке записей');
      }

      setResources(data.resources);
    } catch (error: any) {
      console.error('Ошибка при загрузке записей:', error.message || 'Ошибка при загрузке записей');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    setFormLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при создании записи');
      }
      
      toast.success('Запись успешно создана');
      setTitle('');
      setDescription('');
      setShowForm(false);
      setIsModalOpen(false);
      fetchResources();
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при создании записи');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingResource) return;
    
    if (!title.trim() || !description.trim()) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    setFormLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/resources/${editingResource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при обновлении записи');
      }
      
      toast.success('Запись успешно обновлена');
      setTitle('');
      setDescription('');
      setEditingResource(null);
      setShowForm(false);
      setIsModalOpen(false);
      fetchResources();
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при обновлении записи');
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDeleteResource = async (id: string) => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Запись успешно удалена');
        fetchResources();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Ошибка при удалении записи');
      }
    } catch (error) {
      toast.error('Ошибка при удалении записи');
      console.error('Error deleting resource:', error);
    } finally {
      setFormLoading(false);
      setResourceToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };
  
  const confirmDelete = (id: string) => {
    setResourceToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const cancelDelete = () => {
    setResourceToDelete(null);
    setIsDeleteModalOpen(false);
  };
  
  const handleEditClick = (resource: Resource) => {
    setEditingResource(resource);
    setTitle(resource.title);
    setDescription(resource.description);
    setShowForm(true);
    setIsModalOpen(true);
  };
  
  const handleCancelEdit = () => {
    setTitle('');
    setDescription('');
    setEditingResource(null);
    setShowForm(false);
    setIsModalOpen(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const getFilteredResources = () => {
    if (!searchTerm.trim()) return resources;
    
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const getSortedResources = () => {
    const filtered = getFilteredResources();
    
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'title-asc':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return filtered;
    }
  };
  
  const getCurrentPageItems = () => {
    const sortedResources = getSortedResources();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedResources.slice(indexOfFirstItem, indexOfLastItem);
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  useEffect(() => {
    const filteredResources = getFilteredResources();
    setTotalPages(Math.ceil(filteredResources.length / itemsPerPage));
    
    if (currentPage > Math.ceil(filteredResources.length / itemsPerPage) && filteredResources.length > 0) {
      setCurrentPage(Math.ceil(filteredResources.length / itemsPerPage));
    }
    
    if (filteredResources.length === 0) {
      setCurrentPage(1);
    }
  }, [resources, itemsPerPage, currentPage, searchTerm]);
  
  const getPaginationInfo = () => {
    const filteredResources = getFilteredResources();
    const totalItems = filteredResources.length;
    
    if (totalItems === 0) return '';
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return `${startItem}-${endItem} из ${totalItems}`;
  };
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };
  
  const handleViewResource = (resource: Resource) => {
    setViewingResource(resource);
    setIsViewModalOpen(true);
  };
  
  const closeViewModal = () => {
    setViewingResource(null);
    setIsViewModalOpen(false);
  };
  
  const handleCreateClick = () => {
    setIsModalOpen(true);
    setShowForm(true);
  };

  return (
    <MainLayout>
      <ResourcesContainer>
        <Title>Записи</Title>
        
        <ToastManager toasts={toasts} removeToast={removeToast} />
        
        <ResourceFilters 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onCreateClick={handleCreateClick}
          hasResources={resources.length > 0}
        />
        
        <ResourceForm 
          isOpen={isModalOpen}
          onClose={handleCancelEdit}
          onSubmit={editingResource ? handleUpdateResource : handleCreateResource}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          isLoading={formLoading}
          isEditing={!!editingResource}
        />
        
        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={cancelDelete}
          onConfirm={() => resourceToDelete && handleDeleteResource(resourceToDelete)}
          isLoading={formLoading}
        />
        
        <ResourceViewModal 
          resource={viewingResource}
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          onEdit={handleEditClick}
          formatDate={formatDate}
          userId={userId}
          userRole={userRole}
        />
        
        {isLoading ? (
          <p>Загрузка записей...</p>
        ) : getSortedResources().length === 0 ? (
          <NoResourcesMessage>
            {searchTerm 
              ? 'По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.' 
              : 'Записи не найдены. Создайте первую запись!'}
          </NoResourcesMessage>
        ) : (
          <>
            <ResourcesGrid>
              {getCurrentPageItems().map((resource) => (
                <ResourceCard 
                  key={resource._id}
                  resource={resource}
                  onView={handleViewResource}
                  onEdit={handleEditClick}
                  onDelete={confirmDelete}
                  formatDate={formatDate}
                  userId={userId}
                  userRole={userRole}
                />
              ))}
            </ResourcesGrid>
            
            {getFilteredResources().length > 0 && (
              <ResourcePagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onPageSizeChange={handlePageSizeChange}
                paginationInfo={getPaginationInfo()}
              />
            )}
          </>
        )}
      </ResourcesContainer>
    </MainLayout>
  );
};

export default ResourcesPage; 