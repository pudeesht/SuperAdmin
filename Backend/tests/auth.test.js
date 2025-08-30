

const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');


const app = require('../src/app'); 

const prisma = new PrismaClient();

describe('Auth Routes API', () => {

  let testUser;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('Test1234!', 10);
    
    const superadminRole = await prisma.role.upsert({
      where: { name: 'superadmin' },
      update: {},
      create: { name: 'superadmin', permissions: [] },
    });
    
    testUser = await prisma.user.create({
      data: {
        email: 'testlogin@example.com',
        name: 'Test Login User',
        hashedPassword,
        roles: {
          connect: { id: superadminRole.id }
        }
      }
    });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.$disconnect();
  });


  it('should log in a user with correct credentials and return a token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'testlogin@example.com',
        password: 'Test1234!'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  // Test Case 2: Failed Login (Wrong Password)
  it('should fail to log in with incorrect credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'testlogin@example.com',
        password: 'WrongPassword'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).not.toHaveProperty('token');
    expect(response.body.message).toBe('Invalid credentials.');
  });
});