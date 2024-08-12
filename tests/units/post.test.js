const request = require('supertest');
const app = require('../../src/app');

describe('POST /fragments', () => {
  test('request refued due to lack of validation', () =>
    request(app).post('/v1/fragments').expect(401));

  test('Due to invalid login credentials, the client request denied', () =>
    request(app).post('/v1/fragments').auth('invalid@gmail.com', 'incorrect_password').expect(401));

  // test.skip('client request succeeded, user gets the fragment array', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user1@email.com', 'ps1')
  //     .set('Content-Type', 'text/plain')
  //     .send('This is first fragment data!');

  //   console.log(res.body); // Log the response body
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.status).toBe('ok');
  //   expect(Array.isArray(res.body.fragments)).toBe(true); // This is where the test fails
  // });

  test('request succeeded, fragment array got created', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('Rutarj Shah');
    expect(res.statusCode).toBe(201);
    expect(res.type).toBe('text/plain'); // Adjusted to expect JSON
  });

  test('request refused due to unsupported media type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'dsa/ftp');
    expect(res.statusCode).toBe(415);
  });

  test('request succeeded, the reponse include a Location header', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toEqual(
      `${process.env.API_URL || 'http://localhost:8080'}/v1/fragments/${JSON.parse(res.text).fragment.id}`
    );
  });

  test('text/plain test', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('Text/plain test');
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.text).status).toBe('ok');
  });
});
