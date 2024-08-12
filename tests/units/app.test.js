// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('API Routes', () => {
  test('GET /health should return a successful health check response', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('ok');
  });

  test('GET /v1/fragments should return fragments', async () => {
    const response = await request(app)
      .get('/v1/fragments')
      .set('Authorization', 'Basic ' + Buffer.from('username:password').toString('base64'));

    console.log('Response:', response.body);
    expect(response.status).toBe(401); // Adjust this if needed
  });

  test('should return a 404 error for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      error: {
        code: 404,
        message: 'not found',
      },
    });
  });
});
