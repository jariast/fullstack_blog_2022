const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog');
const { initialBlogs, blogsInDB } = require('../utils/test_helpers');

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

describe('POST', () => {
  test('A valid Blog can be added', async () => {
    const newBlog = {
      title: 'Blog Title 02',
      author: 'camono',
      url: 'google.com',
      likes: 8,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAfterPost = await blogsInDB();
    expect(blogsAfterPost).toHaveLength(initialBlogs.length + 1);

    const blogTitles = blogsAfterPost.map((blog) => blog.title);
    expect(blogTitles).toContain(newBlog.title);
  });

  test('If a blog is missing the likes property, it should default it to 0', async () => {
    const newBlog = {
      title: 'Blog Title 02',
      author: 'camono',
      url: 'google.com',
    };

    const responseBlog = await api.post('/api/blogs').send(newBlog);
    expect(responseBlog.status).toBe(201);
    expect(responseBlog.body.likes).toBe(0);
  });

  test('If a blog is missing its Title the backend will return an error (400)', async () => {
    const newBlog = {
      author: 'camono',
      url: 'google.com',
      likes: 0,
    };

    const responseBlog = await api.post('/api/blogs').send(newBlog);
    expect(responseBlog.status).toBe(400);
  });

  test('If a blog is missing its URL the backend will return an error (400)', async () => {
    const newBlog = {
      title: 'Blog Title',
      author: 'camono',
      likes: 0,
    };

    const responseBlog = await api.post('/api/blogs').send(newBlog);
    expect(responseBlog.status).toBe(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
