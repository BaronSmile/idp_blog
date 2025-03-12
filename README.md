# Blog Next.js

## Особенности

- **Авторизация и аутентификация**
- **Разделение ролей**
- **REST API**: GET, POST, PUT, DELETE.
- **Современный стек**: Next.js, TypeScript, Styled Components
- **Локальное хранилище**: Использование localStorage для хранения данных без настройки базы данных.

## Технологии

- [Next.js](https://nextjs.org/) - React фреймворк с серверным рендерингом
- [TypeScript](https://www.typescriptlang.org/) - Типизированный JavaScript
- [Styled Components](https://styled-components.com/) - CSS-in-JS библиотека
- [JWT](https://jwt.io/) - JSON Web Tokens для аутентификации
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Хеширование паролей
- [localStorage](https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage) - Хранение данных в браузере

## Начало работы

### Предварительные требования

- Node.js (версия 14.x или выше)

### Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/BaronSmile/idp_blog.git
cd idp_blog
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env.local` в корне проекта и добавьте следующие переменные окружения:

```
JWT_SECRET=your-super-secret-key-change-this-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Запустите проект в режиме разработки:

```bash
npm run dev
```

5. Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

## Учетные данные по умолчанию

В системе автоматически создается администратор с следующими учетными данными:

- Email: admin@mail.ru
- Пароль: admin123

## API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/login` - Вход пользователя
- `GET /api/auth/me` - Получение информации о текущем пользователе

### Ресурсы

- `GET /api/resources` - Получение всех ресурсов
- `POST /api/resources` - Создание нового ресурса
- `GET /api/resources/:id` - Получение конкретного ресурса
- `PUT /api/resources/:id` - Обновление ресурса
- `DELETE /api/resources/:id` - Удаление ресурса

### Администрирование

- `GET /api/admin/users` - Получение всех пользователей (только для админов)
- `POST /api/admin/users` - Создание нового пользователя (только для админов)
- `GET /api/admin/users/:id` - Получение конкретного пользователя (только для админов)
- `PUT /api/admin/users/:id` - Обновление пользователя (только для админов)
- `DELETE /api/admin/users/:id` - Удаление пользователя (только для админов)

