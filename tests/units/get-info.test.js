// tests/unit/getById.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/111').expect(401));

  // // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/111')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('returns 404 if fragment not found', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalid-id')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test('authenticated users get a fragments data', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(postRes.statusCode).toBe(201);
    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app)
      .get('/v1/fragments/' + id)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(getRes.text).toBe('This is a fragment');
  });

  test('return 415 for unsupported extension type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(postRes.statusCode).toBe(201);
    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app)
      .get('/v1/fragments/' + id + '.random')
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(415);
  });

  // Cannot convert unsupported type to .html
  test("authenticated users are unableable to do '.html' conversions for unsupported type", async () => {
    // POST a plain fragment with text/plain content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert html fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.html')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  // Cannot convert unsupported type to .md
  test("authenticated users are unableable to do '.md' conversions for unsupported type", async () => {
    // POST a plain fragment with image/png content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert md fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.md')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  // Cannot convert unsupported type to .json
  test("authenticated users are unableable to do '.json' conversions for unsupported type", async () => {
    // POST a plain fragment with text/plain content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert json fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.json')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  // Cannot convert unsupported type to .csv
  test("authenticated users are unableable to do '.csv' conversions for unsupported type", async () => {
    // POST a plain fragment with text/plain content type
    const postRes1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a plain fragment');
    expect(postRes1.statusCode).toBe(201);
    const id1 = JSON.parse(postRes1.text).fragment.id;

    // ---------------------------------------------------------------------------------------------- //
    // Try to convert csv fragment using GET v1/framents/:id:.ext
    const getRes1 = await request(app)
      .get('/v1/fragments/' + id1 + '.csv')
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(415);
  });

  test('return 415 for unsupported content type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/random')
      .send('This is a fragment');
    expect(postRes.statusCode).toBe(415);
  });

  test('returns 404 if fragment not found', async () => {
    const res = await request(app)
      .get('/v1/fragments/nonexistent-id')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
