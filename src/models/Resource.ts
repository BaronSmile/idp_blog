import { getLocalData, setLocalData } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface IResource {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateResourceData {
  title: string;
  description: string;
  createdBy: string;
}

interface UpdateResourceData {
  title?: string;
  description?: string;
}

export const find = async () => {
  return getLocalData<IResource[]>('resources', []);
};

export const sort = async (sortOptions: { [key: string]: number }) => {
  const resources = getLocalData<IResource[]>('resources', []);
  
  return resources.sort((a, b) => {
    for (const [key, value] of Object.entries(sortOptions)) {
      const keyA = a[key as keyof IResource];
      const keyB = b[key as keyof IResource];
      
      if (keyA < keyB) return -1 * value;
      if (keyA > keyB) return 1 * value;
    }
    return 0;
  });
};

export const findById = async (id: string) => {
  const resources = getLocalData<IResource[]>('resources', []);
  return resources.find(resource => resource._id === id) || null;
};

export const create = async (resourceData: CreateResourceData): Promise<IResource> => {
  const resources = getLocalData<IResource[]>('resources', []);
  
  const newResource: IResource = {
    _id: uuidv4(),
    title: resourceData.title,
    description: resourceData.description,
    createdBy: resourceData.createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  resources.push(newResource);
  setLocalData('resources', resources);
  
  return newResource;
};

export const findByIdAndUpdate = async (id: string, updateData: UpdateResourceData) => {
  const resources = getLocalData<IResource[]>('resources', []);
  const resourceIndex = resources.findIndex(resource => resource._id === id);
  
  if (resourceIndex === -1) {
    return null;
  }
  
  const resource = resources[resourceIndex];
  
  const updatedResource: IResource = {
    ...resource,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  resources[resourceIndex] = updatedResource;
  setLocalData('resources', resources);
  
  return updatedResource;
};

export const findByIdAndDelete = async (id: string) => {
  const resources = getLocalData<IResource[]>('resources', []);
  const resourceIndex = resources.findIndex(resource => resource._id === id);
  
  if (resourceIndex === -1) {
    return null;
  }
  
  const deletedResource = resources[resourceIndex];
  resources.splice(resourceIndex, 1);
  setLocalData('resources', resources);
  
  return deletedResource;
};

export default {
  find,
  sort,
  findById,
  create,
  findByIdAndUpdate,
  findByIdAndDelete
}; 