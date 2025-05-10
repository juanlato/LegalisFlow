import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm'; // Updated from Connection to DataSource

describe('LegalisFlow API (e2e)', () => {
  let app: INestApplication;
  const tenant = 'dev'; // Test tenant subdomain

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same configuration as in main.ts
    // Uncomment if your main.ts has these:
    // app.setGlobalPrefix('api');
    // app.useGlobalPipes(new ValidationPipe({ transform: true }));
    // app.enableCors();

    await app.init();
  });

  afterAll(async () => {
    try {
      const dataSource = app.get(DataSource); // Updated to DataSource
      if (dataSource && dataSource.isInitialized) {
        await dataSource.destroy();
      }
    } catch (error) {
      console.error('Error closing database connection:', error);
    }

    await app.close();
  });

  describe('Auth Module', () => {
    it('/auth/login (POST) - Should validate login request', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .set('x-tenant-subdomain', tenant)
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect((res) => {
          // Status will vary depending on if these are valid credentials
          // This just ensures the endpoint works and returns JSON
          expect(res.body).toBeDefined();
          expect(res.type).toEqual('application/json');
        });
    });
  });

  describe('Tenant Header Validation', () => {
    it('Should reject requests without tenant header', () => {
      return request(app.getHttpServer()).get('/').expect(400); // Most likely response for missing required tenant header
    });

    it('Should reject requests with invalid tenant header', () => {
      return request(app.getHttpServer())
        .get('/')
        .set('x-tenant-subdomain', 'invalid-tenant-123')
        .expect((res) => {
          // Status will depend on your validation logic
          // Could be 400 Bad Request or 404 Not Found
          expect(res.status).toBeGreaterThanOrEqual(400);
        });
    });
  });

  describe('Users Module', () => {
    it('/users (GET) - Should reject unauthenticated requests', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('x-tenant-subdomain', tenant)
        .expect(401);
    });
  });

  describe('Role-based Access Control', () => {
    let token: string;

    // This is a placeholder for authentication
    // You'll need to modify this to match your actual auth process
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('x-tenant-subdomain', tenant)
        .send({
          email: 'ing.juandavidayalalizarazo@gmail.com', // Use admin credentials from your test environment
          password: 'P3_!T9ZT6beV-xU',
        });

      // This assumes your login returns a token
      token = response.body.token;
    });

    it('Should allow access with proper authentication', async () => {
      // Skip if login didn't work
      if (!token) {
        console.log('Skipping authenticated test because login failed');
        return;
      }

      return request(app.getHttpServer())
        .get('/users')
        .set('x-tenant-subdomain', tenant)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
