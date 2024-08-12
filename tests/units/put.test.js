// tests/unit/put.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('incorrect type test', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/xml' })
      .send('text/xml type test');
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });

  test('text/plain put test', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('Text/plain test');
    const id = JSON.parse(res.text).fragment.id;

    const res2 = await request(app)
      .put('/v1/fragments/' + id)
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('Text/plain test2');
    expect(res2.statusCode).toBe(201);
    expect(JSON.parse(res.text).status).toBe('ok');

    const res3 = await request(app)
      .get('/v1/fragments/' + id)
      .auth('user1@email.com', 'password1');
    expect(res3.statusCode).toBe(200);
  });
});
