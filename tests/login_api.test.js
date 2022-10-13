const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');

const { initialUsers, saveInitialUsersToDB } = require('../utils/test_helpers');

const api = supertest(app);

beforeAll(async () => {
  await saveInitialUsersToDB();
}, 100000);

describe('Login', () => {
  test('When using valid credentials, should return token and user', async () => {
    const user = { ...initialUsers[0] };
    delete user.name;
    delete user.passwordHash;

    const response = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const resBody = response.body;

    expect(resBody.token).toBeDefined();
    expect(resBody.username).toBeDefined();
    expect(resBody.name).toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
