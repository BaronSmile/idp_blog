import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, getTokenFromHeader } from '@/lib/jwt';
import Resource from '@/models/Resource';

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

    await connectDB();

    const resource = await Resource.findById(params.id);

    if (!resource) {
      return NextResponse.json(
        { error: 'Ресурс не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({ resource });
  } catch (error: any) {
    console.error('Ошибка при получении ресурса:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении ресурса' },
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

    await connectDB();

    const resource = await Resource.findById(params.id);

    if (!resource) {
      return NextResponse.json(
        { error: 'Ресурс не найден' },
        { status: 404 }
      );
    }

    if (resource.createdBy !== payload.userId && payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'У вас нет прав для редактирования этого ресурса' },
        { status: 403 }
      );
    }

    const { title, description } = await request.json();

    const updatedResource = await Resource.findByIdAndUpdate(
      params.id,
      { title, description }
    );

    return NextResponse.json({
      message: 'Ресурс успешно обновлен',
      resource: updatedResource,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ошибка при обновлении ресурса' },
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

    await connectDB();

    const resource = await Resource.findById(params.id);

    if (!resource) {
      return NextResponse.json(
        { error: 'Ресурс не найден' },
        { status: 404 }
      );
    }

    if (resource.createdBy !== payload.userId && payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'У вас нет прав для удаления этого ресурса' },
        { status: 403 }
      );
    }

    await Resource.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Ресурс успешно удален',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ошибка при удалении ресурса' },
      { status: 500 }
    );
  }
} 