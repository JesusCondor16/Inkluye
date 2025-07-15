// src/app/api/syllabus/route.js

import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth'; // si estás usando autenticación
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const codigo = searchParams.get('codigo')?.trim();
    const nombre = searchParams.get('nombre')?.trim();
    const ciclo = searchParams.get('ciclo')?.trim();

    const filtros = [];
    if (codigo) filtros.push({ code: { contains: codigo, mode: 'insensitive' } });
    if (nombre) filtros.push({ name: { contains: nombre, mode: 'insensitive' } });
    if (ciclo) filtros.push({ cycle: { contains: ciclo, mode: 'insensitive' } });

    const cursos = await prisma.course.findMany({
      where: filtros.length ? { AND: filtros } : {},
      include: {
        syllabus: true,
      },
      orderBy: { name: 'asc' },
    });

    const resultados = cursos.map((c) => ({
      id: c.id,
      codigo: c.code,
      nombre: c.name,
      ciclo: c.cycle ?? '—',
      creditos: c.credits,
      pdfUrl: c.syllabus?.pdfUrl ?? null,
    }));

    return NextResponse.json(resultados);
  } catch (error) {
    console.error('Error al buscar syllabus:', error);
    return NextResponse.json(
      { error: 'Error al buscar syllabus' },
      { status: 500 }
    );
  }
}
