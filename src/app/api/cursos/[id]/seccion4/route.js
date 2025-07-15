import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Obtener datos de sección 4
export async function GET(req, { params }) {
  const courseId = parseInt(params.id, 10);

  if (!courseId || isNaN(courseId)) {
    return NextResponse.json({ error: 'ID del curso no válido' }, { status: 400 });
  }

  try {
    const evaluacion = await prisma.evaluacion.findUnique({
      where: { courseId },
      include: { notas: true },
    });

    const matriz = await prisma.matrizEvaluacion.findMany({
      where: { courseId },
      orderBy: { id: 'asc' },
    });

    const bibliografia = await prisma.bibliografia.findMany({
      where: { courseId },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({ evaluacion, matriz, bibliografia });
  } catch (error) {
    console.error('Error al obtener sección 4:', error);
    return NextResponse.json({ error: 'Error al obtener datos de sección 4' }, { status: 500 });
  }
}

// POST: Guardar datos de sección 4
export async function POST(req, { params }) {
  const courseId = parseInt(params.id, 10);

  if (!courseId || isNaN(courseId)) {
    return NextResponse.json({ error: 'ID del curso no válido' }, { status: 400 });
  }

  try {
    const { estrategia, evaluacion, formula, notas = [], matriz = [], bibliografia = [] } = await req.json();

    // Eliminar registros anteriores
    await prisma.nota.deleteMany({
      where: {
        evaluacion: { courseId },
      },
    });

    await prisma.evaluacion.deleteMany({ where: { courseId } });
    await prisma.matrizEvaluacion.deleteMany({ where: { courseId } });
    await prisma.bibliografia.deleteMany({ where: { courseId } });

    // Crear Evaluación y sus notas
    await prisma.evaluacion.create({
      data: {
        estrategia,
        evaluacion,
        formula,
        courseId,
        notas: {
          create: notas.map((texto) => ({ texto })),
        },
      },
    });

    // Crear matriz de evaluación uno por uno para asegurar la relación
    for (const fila of matriz) {
      await prisma.matrizEvaluacion.create({
        data: {
          unidad: fila.unidad ?? '',
          criterio: fila.criterio ?? '',
          desempenio: fila.desempenio ?? '',
          producto: fila.producto ?? '',
          instrumento: fila.instrumento ?? '',
          courseId,
        },
      });
    }

    // Crear bibliografía
    for (const texto of bibliografia) {
      await prisma.bibliografia.create({
        data: {
          texto: texto ?? '',
          courseId,
        },
      });
    }

    return NextResponse.json({ message: 'Sección 4 guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar sección 4:', error);
    return NextResponse.json({ error: 'Error interno al guardar sección 4' }, { status: 500 });
  }
}
