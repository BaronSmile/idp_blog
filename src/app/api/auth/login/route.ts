import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Пожалуйста, укажите email и пароль' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }


    const isPasswordValid = await User.comparePassword(user, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    return NextResponse.json({
      message: 'Вход выполнен успешно',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ошибка при входе в систему' },
      { status: 500 }
    );
  }
} 