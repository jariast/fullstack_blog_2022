const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog');
const { initialBlogs } = require('../utils/test_helpers');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promisesArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promisesArray);
});

describe('GET', () => {
  test('When making a GET request, all blogs are returned and the type content is JSON', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
    expect(response.type).toBe('application/json');
  });

  test('The returned objects have an id property and no longer have the _id property', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).toBeUndefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
