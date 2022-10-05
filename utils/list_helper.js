const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((accum, blog) => accum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((fav, blog) => compareLikes(fav, blog), null);
};

const compareLikes = (currentFav, blog) => {
  if (!currentFav) {
    return blog;
  } else {
    return blog.likes > currentFav.likes ? blog : currentFav;
  }
};

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  const countByAuthorObject = _.countBy(blogs, 'author');

  //Firs we map the objects to {author, blogs} and then we sort desc by blogCount
  const sortedByBlogCount = Object.entries(countByAuthorObject)
    .map((authorBlogs) => {
      return { author: authorBlogs[0], blogs: authorBlogs[1] };
    })
    .sort((a, b) => b.blogs - a.blogs);
  return sortedByBlogCount[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
