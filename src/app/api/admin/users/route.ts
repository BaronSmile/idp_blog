import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken, getTokenFromHeader } from '@/lib/jwt';

async function checkAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return {
      error: NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    };
  }

  const token = getTokenFromHeader(authHeader);
  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Неверный формат токена' },
        { status: 401 }
      )
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      error: NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      )
    };
  }

  if (payload.role !== 'admin') {
    return {
      error: NextResponse.json(
        { error: 'Доступ запрещен. Требуются права администратора' },
        { status: 403 }
      )
    };
  }

  return { payload };
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth(request);
    if (authResult.error) {
      return authResult.error;
    }

    await connectDB();

    const users = await User.find();
    
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json({ users: usersWithoutPasswords });
  } catch (error: any) {
    console.error('Ошибка при получении пользователей:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении пользователей' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth(request);
    if (authResult.error) {
      return authResult.error;
    }

    await connectDB();

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    return NextResponse.json(
      {
        message: 'Пользователь успешно создан',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Ошибка при создании пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании пользователя' },
      { status: 500 }
    );
  }
} 