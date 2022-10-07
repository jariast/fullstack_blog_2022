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

test('When making a GET request, all blogs are returned and the type content is JSON', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
  expect(response.type).toBe('application/json');
});

afterAll(() => {
  mongoose.connection.close();
});
