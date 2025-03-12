import jwt from 'jsonwebtoken';
import { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

if (!JWT_SECRET) {
  throw new Error('Пожалуйста, определите JWT_SECRET в .env.local');
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(user: IUser): string {
  const payload: TokenPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d',
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
} 