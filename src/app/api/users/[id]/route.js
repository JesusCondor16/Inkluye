import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(req, context) {
  const { id } = context.params;

  if (!id || isNaN(parseInt(id))) {
    return new Response(
      JSON.stringify({ error: 'ID inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(req, context) {
  const { id } = context.params;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!id || isNaN(parseInt(id))) {
    return new Response(
      JSON.stringify({ error: 'ID inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Token no proporcionado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const currentUser = await getUserFromToken(token);
  if (!currentUser || currentUser.role !== 'DIRECTOR') {
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { name, email, role } = await req.json();

    if (!name || !email || !role) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, role },
    });

    await prisma.userHistory.create({
      data: {
        userId: parseInt(id),
        changedBy: currentUser.name,
        changedByRole: currentUser.role,
        description: `Modificó los datos del usuario: ${name}`,
      },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno al actualizar usuario' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req, context) {
  const { id } = context.params;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!id || isNaN(parseInt(id))) {
    return new Response(
      JSON.stringify({ error: 'ID inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Token no proporcionado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const currentUser = await getUserFromToken(token);
  if (!currentUser || currentUser.role !== 'DIRECTOR') {
    return new Response(
      JSON.stringify({ error: 'No autorizado' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const userToDelete = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!userToDelete) {
      return new Response(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Eliminar registros relacionados para evitar errores FK
    await prisma.userHistory.deleteMany({
      where: { userId: userToDelete.id },
    });

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: userToDelete.id },
    });

    return new Response(
      JSON.stringify({ message: 'Usuario eliminado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno al eliminar usuario' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
