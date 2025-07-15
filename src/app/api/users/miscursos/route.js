import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization');
    const token = auth?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 });
    }

    const decoded = jwt.decode(token);
    const userId = decoded?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const cursos = await prisma.course.findMany({
      where: {
        coordinadorId: parseInt(userId),
      },
    });

    return NextResponse.json(cursos);
  } catch (error) {
    console.error('Error al obtener mis cursos:', error);
    return NextResponse.json({ error: 'Error al obtener mis cursos' }, { status: 500 });
  }
}
