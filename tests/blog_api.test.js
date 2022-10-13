const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const {
  initialBlogs,
  blogsInDB,
  nonExistingId,
  saveInitialUsersToDB,
} = require('../utils/test_helpers');

const api = supertest(app);
let firstUserId,
  firstUserToken,
  secondUsertoken = '';

beforeAll(async () => {
  await saveInitialUsersToDB();

  const users = await User.find({});
  [firstUserToken, secondUsertoken] = users.map((user) =>
    jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
  );
  firstUserId = users[0]._id;
}, 10000);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => {
    blog.user = firstUserId;
    return new Blog(blog);
  });
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

  test('Gets a blog when providing a valid ID and if the blog exists', async () => {
    const initialBlogsInDB = await blogsInDB();

    const blogToView = initialBlogsInDB[0];

    const responseBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200);

    const processedBlog = JSON.parse(JSON.stringify(blogToView));
    expect(responseBlog.body).toEqual(processedBlog);
  });

  test('Returns 404 when providing a Valid ID but the blog doesnt exist', async () => {
    const validId = await nonExistingId();
    await api.get(`/api/blogs/${validId}`).expect(404);
  });

  test('Returns 400 and an error message when providing an invalid ID', async () => {
    const invalidId = '63400fabb6ac1176061618adsds1sadasds';

    const response = await api.get(`/api/blogs/${invalidId}`).expect(400);
    expect(response.body.error).toBe('malformatted id');
  });
});

describe('POST', () => {
  test('A valid Blog can be added', async () => {
    const newBlog = {
      title: 'Blog Title 02',
      author: 'camono',
      url: 'google.com',
      likes: 8,
      user: firstUserId,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${firstUserToken}`)
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
      user: firstUserId,
    };

    const responseBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${firstUserToken}`);
    expect(responseBlog.status).toBe(201);
    expect(responseBlog.body.likes).toBe(0);
  });

  test('If a blog is missing its Title the backend will return an error (400)', async () => {
    const newBlog = {
      author: 'camono',
      url: 'google.com',
      likes: 0,
      user: firstUserId,
    };

    const responseBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${firstUserToken}`);
    expect(responseBlog.status).toBe(400);
  });

  test('If a blog is missing its URL the backend will return an error (400)', async () => {
    const newBlog = {
      title: 'Blog Title',
      author: 'camono',
      likes: 0,
      user: firstUserId,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${firstUserToken}`)
      .expect(400);
  });
});

describe('DELETE', () => {
  test('Deletes a Blog if valid Id and blog exists', async () => {
    const initialBlogsInDB = await blogsInDB();

    const blogToDelete = initialBlogsInDB[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
      .set('Authorization', `bearer ${firstUserToken}`);

    const blogsAfterDelete = await blogsInDB();

    expect(blogsAfterDelete.length).toBe(initialBlogsInDB.length - 1);

    const blogTitles = blogsAfterDelete.map((blog) => blog.title);
    expect(blogTitles).not.toContain(blogToDelete.title);
  });
});

describe('PUT', () => {
  test('Updates the likes on a Blog', async () => {
    const initialBlogsInDB = await blogsInDB();
    const blogToUpdate = initialBlogsInDB[1];

    blogToUpdate.likes += 10;

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate);

    //OJO: the result of calling the API is an httpResponse, not an Blog Object
    // The Blog Object is inside the body property of the response.
    expect(updatedBlog.body.likes).toBe(blogToUpdate.likes);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
