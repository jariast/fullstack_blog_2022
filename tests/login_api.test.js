const mongoose = require('mongoose');
const supertest = require('supertest');
const bcryptjs = require('bcryptjs');

const app = require('../app');

const User = require('../models/user');
const { initialUsers } = require('../utils/test_helpers');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const userObject = { ...initialUsers[0], passwordHash: '' };

  userObject.passwordHash = await bcryptjs.hash(initialUsers[0].password, 10);
  delete userObject.password;
  const user = new User(userObject);

  await user.save();
});

describe('Login', () => {
  test('When using valid credentils, should return token and user', async () => {
    const user = { ...initialUsers[0] };
    delete user.name;

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
