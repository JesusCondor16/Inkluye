// src/app/api/cursos/[id]/seccion3/route.js
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Obtener capacidades y programaciones
export async function GET(req, { params }) {
  const cursoId = parseInt(params.id);

  if (isNaN(cursoId)) {
    return NextResponse.json({ error: 'ID del curso no válido' }, { status: 400 });
  }

  try {
    const capacidades = await prisma.capacidad.findMany({
      where: { cursoId },
      include: {
        programaciones: {
          orderBy: { id: 'asc' }
        }
      },
      orderBy: { id: 'asc' }
    });

    const resultado = capacidades.map((cap) => ({
      nombre: cap.nombre,
      descripcion: cap.descripcion,
      logro: cap.programaciones[0]?.logroUnidad || '',
      filas: cap.programaciones.map((p) => ({
        sem: p.semana,
        contenido: p.contenido,
        actividades: p.actividades,
        recursos: p.recursos,
        estrategias: p.estrategias
      }))
    }));

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('GET sección 3 error:', error);
    return NextResponse.json({ error: 'Error al obtener la sección 3' }, { status: 500 });
  }
}

// POST: Guardar capacidades y programaciones
export async function POST(req, { params }) {
  const cursoId = parseInt(params.id);

  if (isNaN(cursoId)) {
    return NextResponse.json({ error: 'ID del curso no válido' }, { status: 400 });
  }

  try {
    const unidades = await req.json();

    const antiguas = await prisma.capacidad.findMany({
      where: { cursoId },
      select: { id: true }
    });

    const capacidadIds = antiguas.map((c) => c.id);

    if (capacidadIds.length > 0) {
      await prisma.programacionContenido.deleteMany({
        where: { capacidadId: { in: capacidadIds } }
      });
    }

    await prisma.capacidad.deleteMany({ where: { cursoId } });

    for (const unidad of unidades) {
      await prisma.capacidad.create({
        data: {
          nombre: unidad.nombre,
          descripcion: unidad.descripcion,
          cursoId,
          programaciones: {
            create: Array.isArray(unidad.filas)
              ? unidad.filas.map((fila) => ({
                  logroUnidad: unidad.logro || '',
                  semana: fila.sem || '',
                  contenido: fila.contenido || '',
                  actividades: fila.actividades || '',
                  recursos: fila.recursos || '',
                  estrategias: fila.estrategias || ''
                }))
              : []
          }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST sección 3 error:', error);
    return NextResponse.json({ error: 'Error al guardar la sección 3' }, { status: 500 });
  }
}
