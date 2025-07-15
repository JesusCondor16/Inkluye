import { prisma } from '@/lib/prisma';

export async function GET(_req, context) {
  const { id } = await context.params; // ✅ Aquí va el await

  try {
    const historial = await prisma.userHistory.findMany({
      where: { userId: parseInt(id) },
      orderBy: { changeDate: 'desc' },
    });

    return Response.json(historial);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
