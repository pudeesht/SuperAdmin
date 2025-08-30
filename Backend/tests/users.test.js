// backend/tests/users.test.js

const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('User CRUD API', () => {
  
  
  
  let superadminToken;
  let createdUser;

  // This runs once before all tests in this file
  beforeAll(async () => {
    // --- START OF FIX ---
    // Create BOTH roles that our application logic needs
    await prisma.role.upsert({
      where: { name: 'superadmin' },
      update: {},
      create: { name: 'superadmin', permissions: ['users:create', 'users:read'] },
    });
    
    // Add the default 'user' role so that createUser controller can find it
    await prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: { name: 'user', permissions: [] },
    });
    // --- END OF FIX ---

    await prisma.user.create({
      data: {
        email: 'testadmin@example.com',
        name: 'Test Admin',
        hashedPassword: await require('bcryptjs').hash('adminpassword', 10),
        roles: { connect: { name: 'superadmin' } },
      },
    });

    // 2. Log in as the superadmin to get a token
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'testadmin@example.com',
        password: 'adminpassword',
      });
    
    superadminToken = loginRes.body.token;
  });

  // This runs once after all tests in this file
  afterAll(async () => {
    // Clean up all data
    await prisma.auditLog.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.$disconnect();
  });


  it('should prevent access to user list without a token', async () => {
    const response = await request(app).get('/api/v1/superadmin/users');
    expect(response.statusCode).toBe(401);
  });

//   it('should create a new user when authenticated as superadmin', async () => {
//     const response = await request(app)
//       .post('/api/v1/superadmin/users')
//       .set('Authorization', `Bearer ${superadminToken}`) // Use the token
//       .send({
//         email: 'newuser@example.com',
//         password: 'password123',
//         name: 'New User',
//       });

//     expect(response.statusCode).toBe(201);
//     expect(response.body.email).toBe('newuser@example.com');
//     expect(response.body).not.toHaveProperty('hashedPassword');

//     // Save the created user for other tests
//     createdUser = response.body;
//   });

    it('should create a new user when authenticated as superadmin', async () => {
    const response = await request(app)
      .post('/api/v1/superadmin/users')
      .set('Authorization', `Bearer ${superadminToken}`) // Use the token
      .send({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      });

    // --- ADD THIS DEBUGGING LOG ---
    // This will show us exactly what the API is returning.
    // console.log('DEBUG: Create User API Response Body:', response.body);
    // console.log('DEBUG: Create User API Status Code:', response.statusCode);
    // --- END OF DEBUGGING LOG ---

    expect(response.statusCode).toBe(201);
    expect(response.body.data.email).toBe('newuser@example.com');
    expect(response.body.data).not.toHaveProperty('hashedPassword');

    // Save the created user for other tests
    createdUser = response.body.data;
    });

  it('should get a list of users', async () => {
    const response = await request(app)
      .get('/api/v1/superadmin/users')
      .set('Authorization', `Bearer ${superadminToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    // Check if our newly created user is in the list
    expect(response.body.data.some(user => user.id === createdUser.id)).toBe(true);
  });

  it('should get a single user by their ID', async () => {
    const response = await request(app)
      .get(`/api/v1/superadmin/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${superadminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(createdUser.id);
  });
  
  it('should update a user\'s details', async () => {
    const response = await request(app)
      .put(`/api/v1/superadmin/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({ name: 'Updated Name' });
      
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Updated Name');
  });

  it('should delete a user', async () => {
    const response = await request(app)
      .delete(`/api/v1/superadmin/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${superadminToken}`);

    expect(response.statusCode).toBe(204);

    // Verify the user is actually gone
    const getResponse = await request(app)
      .get(`/api/v1/superadmin/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${superadminToken}`);
    
    expect(getResponse.statusCode).toBe(404);
  });
});