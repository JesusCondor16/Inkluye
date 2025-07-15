import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, oldPassword, newPassword } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return Response.json({ message: 'La contraseña actual no es correcta' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return Response.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error en reset-password:', error);
    return Response.json({ message: 'Error al cambiar contraseña' }, { status: 500 });
  }
}
