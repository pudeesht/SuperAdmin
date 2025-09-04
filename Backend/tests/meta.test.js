
const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prismaClient');

describe('Meta API Endpoints (Analytics & Audit Logs)', () => {
  let superadminToken;
  let adminUser;

  beforeAll(async () => {
    await prisma.role.upsert({ where: { name: 'superadmin' }, update: {}, create: { name: 'superadmin' } });
    await prisma.role.upsert({ where: { name: 'user' }, update: {}, create: { name: 'user' } });
    
    adminUser = await prisma.user.create({
      data: {
        email: 'metaadmin@example.com',
        name: 'Meta Admin',
        hashedPassword: await require('bcryptjs').hash('adminpassword', 10),
        roles: { connect: { name: 'superadmin' } },
      },
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'metaadmin@example.com', password: 'adminpassword' });
    
    superadminToken = loginRes.body.token;

    await request(app)
      .post('/api/v1/superadmin/users')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        email: 'metauser@example.com',
        password: 'password123',
        name: 'Meta User',
      });
  });

  afterAll(async () => {
    await prisma.auditLog.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
  });


  describe('Analytics Endpoint', () => {
    it('should return a summary of analytics data', async () => {
      const response = await request(app)
        .get('/api/v1/superadmin/analytics/summary')
        .set('Authorization', `Bearer ${superadminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(response.body.data).toHaveProperty('totalRoles');
      expect(response.body.data).toHaveProperty('activeUsersLast7Days');

      expect(response.body.data.totalUsers).toBe(2);
      expect(response.body.data.totalRoles).toBe(2);
      expect(response.body.data.activeUsersLast7Days).toBe(1);
    });
  });

  describe('Audit Log Endpoint', () => {
    it('should return a list of audit logs', async () => {
      const response = await request(app)
        .get('/api/v1/superadmin/audit-logs')
        .set('Authorization', `Bearer ${superadminToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data[0]).toHaveProperty('action');
      expect(response.body.data[0]).toHaveProperty('actor');
    });

    it('should filter audit logs by action type', async () => {
      const response = await request(app)
        .get('/api/v1/superadmin/audit-logs?action=CREATE_USER')
        .set('Authorization', `Bearer ${superadminToken}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].action).toBe('CREATE_USER');
    });

    it('should filter audit logs by the user who performed the action (actor)', async () => {
        const response = await request(app)
          .get(`/api/v1/superadmin/audit-logs?userId=${adminUser.id}`)
          .set('Authorization', `Bearer ${superadminToken}`);
  
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        response.body.data.forEach(log => {
          expect(log.actorUserId).toBe(adminUser.id);
        });
      });
  });
});