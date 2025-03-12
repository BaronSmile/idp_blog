const bcrypt = require('bcryptjs');

// Функция для генерации хеша пароля
async function generatePasswordHash(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Пример использования
async function main() {
  const password = 'admin123';
  const hash = await generatePasswordHash(password);
  console.log(`Пароль: ${password}`);
  console.log(`Хеш: ${hash}`);
  
  // Проверка хеша
  const isValid = await bcrypt.compare(password, hash);
  console.log(`Проверка хеша: ${isValid}`);
}

// Запускаем функцию
main().catch(console.error); 