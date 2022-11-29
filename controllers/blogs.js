const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const shouldPopulate = request.query.populate;
  const blogs = shouldPopulate
    ? await Blog.find({}).populate('user', { username: 1, name: 1 })
    : await Blog.find({});
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
    return response.status(204).end();
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
  // const update = {
  //   likes: request.body.likes,
  // };
  //I think I was making a mistake by only updating the likes property
  //The PUT method assumes we're going to replace the entire object, so we must send the entire blog
  //from the frontEnd
  const blog = request.body;

  blog.user = blog.user.id;

  //We must rerun the validators in order to ensure that the Blog object meets the
  //schema requirements.
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
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
