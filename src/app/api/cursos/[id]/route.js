// src/app/api/cursos/[id]/route.js

import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// ✅ GET /api/cursos/[id]
export async function GET(_req, context) {
  const id = parseInt(context.params.id);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const curso = await prisma.course.findUnique({
      where: { id },
      include: {
        prerequisites: {
          include: { prerequisite: true },
        },
        cursoDocentes: {
          include: { user: true },
        },
        coordinador: true,
      },
    });

    if (!curso) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    // Extraemos docentes desde cursoDocentes
    const docentes = curso.cursoDocentes.map((cd) => cd.user);

    return NextResponse.json({
      ...curso,
      docentes,
    });
  } catch (err) {
    console.error('Error al obtener curso:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// ✅ PUT /api/cursos/[id]
export async function PUT(req, context) {
  const id = parseInt(context.params.id);

  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user || user.role !== 'DIRECTOR') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const {
      name, code, type, area, weeks,
      semester, cycle, credits, modality,
      theoryHours, practiceHours, labHours,
      group, sumilla,
      coordinadorId, docentes = [], prerrequisitos = [],
    } = await req.json();

    const curso = await prisma.course.update({
      where: { id },
      data: {
        name,
        code,
        type,
        area,
        weeks,
        semester,
        cycle,
        credits,
        modality,
        theoryHours,
        practiceHours,
        labHours,
        group,
        sumilla,
        coordinadorId: coordinadorId ? parseInt(coordinadorId) : null,
      },
    });

    // Actualizar docentes
    await prisma.cursoDocente.deleteMany({ where: { courseId: id } });
    if (docentes.length > 0) {
      await prisma.cursoDocente.createMany({
        data: docentes.map((userId) => ({
          courseId: id,
          userId: parseInt(userId),
        })),
      });
    }

    // Actualizar prerrequisitos
    await prisma.prerequisite.deleteMany({ where: { courseId: id } });
    if (prerrequisitos.length > 0) {
      await prisma.prerequisite.createMany({
        data: prerrequisitos.map((pid) => ({
          courseId: id,
          prerequisiteId: parseInt(pid),
        })),
      });
    }

    return NextResponse.json({ message: 'Curso actualizado correctamente', curso });
  } catch (err) {
    console.error('Error al actualizar curso:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// ✅ DELETE /api/cursos/[id]
export async function DELETE(req, context) {
  const id = parseInt(context.params.id);

  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user || user.role !== 'DIRECTOR') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await prisma.cursoDocente.deleteMany({ where: { courseId: id } });
    await prisma.prerequisite.deleteMany({ where: { courseId: id } });
    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ message: 'Curso eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar curso:', err);
    return NextResponse.json({ error: 'Error al eliminar el curso' }, { status: 500 });
  }
}
