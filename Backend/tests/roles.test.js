const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prismaClient');

describe('Role & Permissions API', () => {
  let superadminToken;
  let testUser;
  let createdRole;

  beforeAll(async () => {
    await prisma.role.upsert({ where: { name: 'superadmin' }, update: {}, create: { name: 'superadmin' } });
    await prisma.role.upsert({ where: { name: 'user' }, update: {}, create: { name: 'user' } });
    
    testUser = await prisma.user.create({
      data: {
        email: 'roletestuser@example.com',
        name: 'Role Test User',
        hashedPassword: await require('bcryptjs').hash('password123', 10),
        roles: { connect: { name: 'user' } }
      }
    });

    await prisma.user.create({
      data: {
        email: 'roleadmin@example.com',
        name: 'Role Admin',
        hashedPassword: await require('bcryptjs').hash('adminpassword', 10),
        roles: { connect: { name: 'superadmin' } },
      },
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'roleadmin@example.com', password: 'adminpassword' });
    
    superadminToken = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.auditLog.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
  });

  it('should create a new role successfully', async () => {
    const response = await request(app)
      .post('/api/v1/superadmin/roles')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        name: 'editor',
        permissions: ['posts:create', 'posts:edit']
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.name).toBe('editor');
    expect(response.body.data.permissions).toEqual(['posts:create', 'posts:edit']);

    createdRole = response.body.data; 
  });
  
  it('should get a list of all roles', async () => {
    const response = await request(app)
      .get('/api/v1/superadmin/roles')
      .set('Authorization', `Bearer ${superadminToken}`);
      
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    // We expect 'superadmin', 'user', and our new 'editor' role
    expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    expect(response.body.data.some(role => role.name === 'editor')).toBe(true);
  });
  
  it('should update an existing role', async () => {
    const response = await request(app)
      .put(`/api/v1/superadmin/roles/${createdRole.id}`)
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        name: 'contributor',
        permissions: ['posts:create']
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.name).toBe('contributor');
    expect(response.body.data.permissions).toEqual(['posts:create']);
  });

  it('should assign a role to a user', async () => {
    const response = await request(app)
      .post('/api/v1/superadmin/assign-role')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        userId: testUser.id,
        roleId: createdRole.id
      });
      
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Role assigned successfully.');

    // Verification step: Check if the user actually has the new role
    const userWithRoles = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: { roles: true }
    });
    
    const roleNames = userWithRoles.roles.map(role => role.name);
    // User should have their original 'user' role AND the new 'contributor' role
    expect(roleNames).toContain('user');
    expect(roleNames).toContain('contributor');
  });
});