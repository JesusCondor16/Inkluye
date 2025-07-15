import { prisma } from '@/lib/prisma';
import { getUserFromToken, hashPassword } from '@/lib/auth';

// GET: Obtener usuarios por rol (solo DIRECTOR puede hacerlo)
export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token no proporcionado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await getUserFromToken(token);

    if (!user || user.role !== 'DIRECTOR') {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { searchParams } = new URL(req.url);
    const rolesParam = searchParams.get('roles');

    const where = rolesParam
      ? { role: { in: rolesParam.split(',').map(r => r.trim().toUpperCase()) } }
      : {};

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST: Registrar nuevo usuario (solo DIRECTOR puede hacerlo)
export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token no proporcionado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await getUserFromToken(token);

    if (!user || user.role !== 'DIRECTOR') {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(JSON.stringify({ error: 'Ya existe un usuario con ese correo' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hashedPassword = await hashPassword(password);

    const nuevoUsuario = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return new Response(JSON.stringify(nuevoUsuario), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error al registrar nuevo usuario:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
