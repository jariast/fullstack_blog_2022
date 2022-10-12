const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  blog ? response.json(blog) : response.status(404).end();
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blogId = request.params.id;

  const user = request.user;
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw Error('BlogNotFound');
  }

  if (user.id.toString() !== blog.user.toString()) {
    throw Error('InvalidToken');
  }

  await blog.delete();

  //We must map each blogId to a String because they are objects at the moment
  const blogIdsStrings = user.blogs.map((x) => x.toString());
  user.blogs = blogIdsStrings.filter((x) => x !== blogId);
  await user.save();

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

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blogObject = request.body;

  const creator = request.user;

  blogObject.user = creator._id;
  const blog = new Blog(request.body);

  const savedBlog = await blog.save();

  creator.blogs = creator.blogs.concat(savedBlog._id);
  await creator.save();

  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
