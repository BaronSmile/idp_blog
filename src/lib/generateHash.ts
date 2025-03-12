import bcrypt from 'bcryptjs';

export async function generatePasswordHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  const password = 'admin123';
  const hash = await generatePasswordHash(password);
  console.log(`Пароль: ${password}`);
  console.log(`Хеш: ${hash}`);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log(`Проверка хеша: ${isValid}`);
}

if (require.main === module) {
  main().catch(console.error);
} 