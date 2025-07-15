// src/app/api/cursos/[id]/seccion2/route.js
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Obtener competencias y logros
export async function GET(req, context) {
  const { params } = context;
  const cursoId = Number(params.id);

  if (!cursoId || isNaN(cursoId)) {
    return NextResponse.json({ error: 'ID del curso no válido' }, { status: 400 });
  }

  try {
    const competencias = await prisma.competencia.findMany({
      where: { cursoId },
    });

    const logros = await prisma.logro.findMany({
      where: { cursoId },
    });

    return NextResponse.json({ competencias, logros });
  } catch (error) {
    console.error('Error al obtener sección 2:', error);
    return NextResponse.json({ error: 'Error al obtener datos de sección 2' }, { status: 500 });
  }
}

// POST: Guardar competencias y logros
export async function POST(req, context) {
  const { params } = context;
  const cursoId = Number(params.id);

  if (!cursoId || isNaN(cursoId)) {
    return NextResponse.json({ error: 'ID del curso no válido' }, { status: 400 });
  }

  try {
    const { competencias = [], logros = [] } = await req.json();

    // Eliminar anteriores
    await prisma.competencia.deleteMany({ where: { cursoId } });
    await prisma.logro.deleteMany({ where: { cursoId } });

    // Insertar nuevas
    if (competencias.length > 0) {
      await prisma.competencia.createMany({
        data: competencias.map((c) => ({
          codigo: c.codigo,
          descripcion: c.descripcion,
          tipo: c.tipo,
          nivel: c.nivel,
          cursoId,
        })),
      });
    }

    if (logros.length > 0) {
      await prisma.logro.createMany({
        data: logros.map((l) => ({
          codigo: l.codigo,
          descripcion: l.descripcion,
          tipo: l.tipo || '',   // puedes asignar '' si no se recoge desde el frontend
          nivel: l.nivel || '', // evita valores undefined
          cursoId,
        })),
      });
    }

    return NextResponse.json({ message: 'Sección 2 guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar sección 2:', error);
    return NextResponse.json({ error: 'Error al guardar sección 2' }, { status: 500 });
  }
}
