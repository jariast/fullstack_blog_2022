const mongoose = require('mongoose');
const supertest = require('supertest');
const bcryptjs = require('bcryptjs');

const app = require('../app');
const User = require('../models/user');
const { initialUsers, usersInDB } = require('../utils/test_helpers');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const userObject = { ...initialUsers[0], passwordHash: '' };

  userObject.passwordHash = await bcryptjs.hash(initialUsers[0].password, 10);
  delete userObject.password;
  const user = new User(userObject);

  await user.save();

  //We could use this approach, but it takes several seconds just to create the users
  //So we'll stick with creating a single user.
  // const userObjects = await Promise.all(
  //   initialUsers.map(async (userObject) => {
  //     const passHash = await bcryptjs.hash(userObject.password, 10);
  //     delete userObject.password;
  //     userObject.passwordHash = passHash;
  //     return new User(userObject);
  //   })
  // );

  // const promisesArray = userObjects.map((user) => user.save());

  // await Promise.all(promisesArray);
});

describe('GET', () => {
  test('All users are returned, have an id property and no longer have the _id, __v and passwordHash properties', async () => {
    const initialUsersinDB = await usersInDB();

    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBe(initialUsersinDB.length);
    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).toBeUndefined();
    expect(response.body[0].__v).toBeUndefined();
    expect(response.body[0].passwordHash).toBeUndefined();
  });
});

describe('POST', () => {
  test('User can be created', async () => {
    const initialUsersinDB = await usersInDB();

    const newUserObject = { ...initialUsers[1] };

    const newUserResponse = await api
      .post('/api/users')
      .send(newUserObject)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(newUserResponse.body.id).toBeDefined();
    expect(newUserResponse.body._id).toBeUndefined();
    expect(newUserResponse.body.__v).toBeUndefined();
    expect(newUserResponse.body.passwordHash).toBeUndefined();

    const usersAfterCreation = await usersInDB();

    expect(usersAfterCreation.length).toBe(initialUsersinDB.length + 1);

    const usernames = usersAfterCreation.map((user) => user.username);

    expect(usernames).toContain(newUserObject.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
