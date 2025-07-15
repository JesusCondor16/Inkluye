import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Obtener todos los cursos
export async function GET() {
  try {
    const cursos = await prisma.course.findMany({
      include: {
        coordinador: true,
        cursoDocentes: {
          include: { user: true },
        },
        prerequisites: {
          include: { prerequisite: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Transformar docentes en arreglo simple para el frontend
    const cursosTransformados = cursos.map((curso) => ({
      ...curso,
      docentes: curso.cursoDocentes.map((cd) => cd.user),
    }));

    return NextResponse.json(cursosTransformados);
  } catch (error) {
    console.error('Error al listar cursos:', error);
    return NextResponse.json({ error: 'Error al listar cursos' }, { status: 500 });
  }
}

// POST: Crear un nuevo curso
export async function POST(req) {
  try {
    const data = await req.json();

    const {
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
      coordinadorId,
      docentes = [],
      prerrequisitos = [],
      group,
      sumilla,
    } = data;

    // 🔒 Verificar si ya existe un curso con el mismo código
    const cursoExistente = await prisma.course.findUnique({ where: { code } });
    if (cursoExistente) {
      return NextResponse.json(
        { error: 'Ya existe un curso con ese código' },
        { status: 409 }
      );
    }

    // ✅ Crear el nuevo curso
    const nuevoCurso = await prisma.course.create({
      data: {
        name,
        code,
        type,
        area,
        weeks: weeks ? parseInt(weeks) : null,
        semester,
        cycle,
        credits: credits ? parseInt(credits) : 0,
        modality,
        theoryHours: theoryHours ? parseInt(theoryHours) : null,
        practiceHours: practiceHours ? parseInt(practiceHours) : null,
        labHours: labHours ? parseInt(labHours) : null,
        group,
        sumilla,
        coordinador: coordinadorId
          ? { connect: { id: parseInt(coordinadorId) } }
          : undefined,
      },
    });

    // Relación N:M con docentes (CursoDocente)
    if (docentes.length > 0) {
      await Promise.all(
        docentes.map((id) =>
          prisma.cursoDocente.create({
            data: {
              courseId: nuevoCurso.id,
              userId: parseInt(id),
            },
          })
        )
      );
    }

    // Relación N:M con prerrequisitos
    if (prerrequisitos.length > 0) {
      const relaciones = prerrequisitos.map((id) => ({
        courseId: nuevoCurso.id,
        prerequisiteId: parseInt(id),
      }));
      await prisma.prerequisite.createMany({ data: relaciones });
    }

    return NextResponse.json(nuevoCurso, { status: 201 });
  } catch (error) {
    console.error('Error al crear curso:', error);

    // Si el error es de restricción única, mostrar mensaje claro
    if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
      return NextResponse.json(
        { error: 'Ya existe un curso con ese código' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear curso' },
      { status: 500 }
    );
  }
}
