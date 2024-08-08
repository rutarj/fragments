// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('GET /fragments/?expand=1', async () => {
    const arrPost = [];
    for (let index = 0; index < 2; index++) {
      const resPost = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('content-type', 'text/plain')
        .send('This is a fragment')
        .expect(201);
      arrPost.push(resPost.body.fragment);
    }

    const res = await request(app)
      .get('/v1/fragments/?expand=1')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments).toEqual(arrPost);
  });

  test.skip('authenticated users get .html markdown', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('Text/plain test');
    const id = JSON.parse(res.text).fragment.id;

    const res2 = await request(app)
      .get('/v1/fragments/' + id + '.html')
      .auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });
});
