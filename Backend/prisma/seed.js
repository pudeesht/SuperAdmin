const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const hashedPassword = await bcrypt.hash('Test1234', 10);

  const superadminRole = await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: {},
    create: {
      name: 'superadmin',
      permissions: [
        'users:create',
        'users:read',
        'users:update',
        'users:delete',
        'roles:assign',
      ],
    },
  });

  const userRole = await prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: {
        name: 'user',
        permissions: [],
      },
    });


  const superadminUser = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      name: 'Super Admin',
      hashedPassword: hashedPassword,
      roles: {
        connect: { id: superadminRole.id },
      },
    },
  });

  console.log('Seeding finished.');
  console.log(`Created role: ${superadminRole.name}`);
  console.log(`Created role: ${userRole.name}`);
  console.log(`Created user: ${superadminUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });