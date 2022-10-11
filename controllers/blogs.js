const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  blog ? response.json(blog) : response.status(404).end();
});

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;

  await Blog.findByIdAndRemove(id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;

  //It seems like even if the likes property is not set, the DB just resturns the Document
  //Maybe review if we must validate that the request has the likes property
  const update = {
    likes: request.body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, update, {
    new: true,
  });

  response.json(updatedBlog);
});

blogsRouter.post('/', async (request, response) => {
  const blogObject = request.body;
  const users = await User.find({});

  const creator = users[0];
  blogObject.user = creator._id;
  const blog = new Blog(request.body);

  const savedBlog = await blog.save();

  creator.blogs = creator.blogs.concat(savedBlog._id);
  await creator.save();

  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
