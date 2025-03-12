import bcrypt from 'bcryptjs';
import {getLocalData, setLocalData} from '@/lib/db';
import {v4 as uuidv4} from 'uuid';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'admin';
}

interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  role?: 'user' | 'admin';
}

export const find = async () => {
  return getLocalData<IUser[]>('users', []);
};

export const findById = async (id: string) => {
  const users = getLocalData<IUser[]>('users', []);
  return users.find(user => user._id === id) || null;
};

export const findOne = async (condition: Partial<IUser>) => {
  const users = getLocalData<IUser[]>('users', []);
  
  return users.find(user => {
    for (const [key, value] of Object.entries(condition)) {
      if (user[key as keyof IUser] !== value) {
        return false;
      }
    }
    return true;
  }) || null;
};

export const create = async (userData: CreateUserData): Promise<IUser> => {
  const users = getLocalData<IUser[]>('users', []);
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  const newUser: IUser = {
    _id: uuidv4(),
    email: userData.email,
    password: hashedPassword,
    name: userData.name,
    role: userData.role || 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  setLocalData('users', users);
  
  const { password, ...userWithoutPassword } = newUser;
  return { ...userWithoutPassword, password: '' } as IUser;
};

export const findByIdAndUpdate = async (id: string, updateData: UpdateUserData) => {
  const users = getLocalData<IUser[]>('users', []);
  const userIndex = users.findIndex(user => user._id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  const user = users[userIndex];
  
  const updatedUser: IUser = {
    ...user,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updatedUser.password = await bcrypt.hash(updateData.password, salt);
  }
  
  users[userIndex] = updatedUser;
  setLocalData('users', users);
  
  const { password, ...userWithoutPassword } = updatedUser;
  return { ...userWithoutPassword, password: '' } as IUser;
};

export const findByIdAndDelete = async (id: string) => {
  const users = getLocalData<IUser[]>('users', []);
  const userIndex = users.findIndex(user => user._id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  setLocalData('users', users);
  
  return deletedUser;
};

export const comparePassword = async (user: IUser, candidatePassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    console.error('Ошибка при сравнении паролей:', error);
    return false;
  }
};

export default {
  find,
  findById,
  findOne,
  create,
  findByIdAndUpdate,
  findByIdAndDelete,
  comparePassword
}; 