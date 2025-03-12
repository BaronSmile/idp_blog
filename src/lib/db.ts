declare global {
  var dbData: Record<string, any>;
}

interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

if (!global.dbData) {
  global.dbData = {};
}

export function getLocalData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return global.dbData[key] || defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Ошибка при получении данных из localStorage (${key}):`, error);
    return defaultValue;
  }
}

export function setLocalData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    global.dbData[key] = value;
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Ошибка при сохранении данных в localStorage (${key}):`, error);
  }
}

async function connectDB(): Promise<void> {
  console.log('Fake база данных');
  
  let users = getLocalData<IUser[]>('users', []);
  
  users = users.map(user => {
    if (!user.role) {
      return {
        ...user,
        role: user._id === '1' ? 'admin' : 'user'
      };
    }
    return user;
  });
  
  if (users.length === 0) {
    const defaultAdmin: IUser = {
      _id: '1',
      name: 'Администратор',
      email: 'admin@mail.ru',
      //admin123
      password: '$2a$10$nm2HHd8njArr0njI8xqtweNdbrNZ88wPrZ63Qb5eIVkVuUG5ccocO',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users = [defaultAdmin];
    console.log('Создан администратор по умолчанию:', defaultAdmin.email);
  }
  
  setLocalData('users', users);
  
  const resources = getLocalData('resources', []);
  if (resources.length === 0) {
    setLocalData('resources', []);
    console.log('Пустое хранилище');
  }
}

export default connectDB; 