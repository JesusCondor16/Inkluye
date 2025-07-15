import jwt from 'jsonwebtoken';

export function getUserFromToken(authHeader) {
  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Encabezado Authorization inválido');
    }

    const token = authHeader.split(' ')[1]; // ✅ Extrae el token
    const secret = process.env.JWT_SECRET;

    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error('Token inválido:', error);
    return null;
  }
}