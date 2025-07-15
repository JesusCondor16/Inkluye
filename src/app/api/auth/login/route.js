import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
  }

  // ✅ AÑADIDO name al token
  const token = signToken({
    id: user.id,
    name: user.name, 
    email: user.email,
    role: user.role,
  });

  return NextResponse.json({ token });
}
