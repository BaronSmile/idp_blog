import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, getTokenFromHeader } from '@/lib/jwt';
import Resource from '@/models/Resource';
import User from '@/models/User';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
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

    const resources = await Resource.find();
    const sortedResources = await Promise.all(
      resources
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map(async (resource) => {
          const creator = await User.findById(resource.createdBy);
          return {
            ...resource,
            creatorName: creator ? creator.name : 'Неизвестный пользователь'
          };
        })
    );

    return NextResponse.json({ resources: sortedResources });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ошибка при получении ресурсов' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Пожалуйста, укажите заголовок и описание' },
        { status: 400 }
      );
    }

    const resource = await Resource.create({
      title,
      description,
      createdBy: payload.userId,
    });

    return NextResponse.json(
      {
        message: 'Ресурс успешно создан',
        resource,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ошибка при создании ресурса' },
      { status: 500 }
    );
  }
} 