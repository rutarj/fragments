const request = require('supertest');
const app = require('../../src/app');

describe('404 handler', () => {
  it('should return a 404 error for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
