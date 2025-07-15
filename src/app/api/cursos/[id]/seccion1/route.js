import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req, context) {
  const { params } = context;
  const cursoId = parseInt(params.id, 10);

  if (!cursoId || isNaN(cursoId)) {
    return NextResponse.json({ error: 'ID del curso no válido' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { sumilla } = body;

    const updated = await prisma.course.update({
      where: { id: cursoId },
      data: { sumilla },
    });

    return NextResponse.json({ message: 'Sumilla actualizada', data: updated });
  } catch (err) {
    console.error('Error al actualizar sumilla:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
