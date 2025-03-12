import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken, getTokenFromHeader } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    const token = getTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json(
        { error: 'Неверный формат токена' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      );
    }

    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен. Требуются права администратора' },
        { status: 403 }
      );
    }

    await connectDB();

    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ошибка при получении пользователя' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    const token = getTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json(
        { error: 'Неверный формат токена' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      );
    }

    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен. Требуются права администратора' },
        { status: 403 }
      );
    }

    await connectDB();

    const { name, email, role } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { name, email, role }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Пользователь успешно обновлен',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении пользователя' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    const token = getTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json(
        { error: 'Неверный формат токена' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      );
    }

    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен. Требуются права администратора' },
        { status: 403 }
      );
    }

    await connectDB();

    if (params.id === payload.userId) {
      return NextResponse.json(
        { error: 'Вы не можете удалить свою учетную запись' },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(params.id);

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Пользователь успешно удален',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ошибка при удалении пользователя' },
      { status: 500 }
    );
  }
} 