// src/lib/auth.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Hashear contraseña
function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Verificar contraseña
function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Firmar token JWT
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Obtener usuario desde el token JWT
async function getUserFromToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (err) {
    console.error('Error al verificar token:', err);
    return null;
  }
}

// Exportar funciones
module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  getUserFromToken,
};
