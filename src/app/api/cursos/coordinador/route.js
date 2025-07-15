import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token no proporcionado' }), { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user || user.role !== 'COORDINADOR') {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
    }

    const cursos = await prisma.course.findMany({
      where: {
        coordinadorId: user.id,
      },
      include: {
        cursoDocentes: {
          include: {
            user: true, // para obtener datos del docente
          },
        },
        prerequisites: {
          include: {
            prerequisite: true, // para obtener datos del curso prerrequisito
          },
        },
        coordinador: true, // para obtener el nombre del coordinador actual
      },
    });

    return Response.json(cursos);
  } catch (error) {
    console.error('Error en /api/cursos/coordinador:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
}
