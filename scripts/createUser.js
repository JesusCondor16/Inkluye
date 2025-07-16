// scripts/createUser.js
require('dotenv').config(); // Carga las variables del entorno

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hashear la contraseña
  const passwordHash = await bcrypt.hash('123456', 10);

  // Crear usuario de prueba
  const user = await prisma.user.create({
    data: {
      name: 'Jesus',
      email: 'mario@ejemplo.com',
      password: passwordHash,
      role: 'DOCENTE', // Puedes cambiarlo a COORDINADOR, DOCENTE, etc.
    },
  });

  console.log('✅ Usuario creado:', user);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error al crear usuario:', err);
    process.exit(1);
  });
