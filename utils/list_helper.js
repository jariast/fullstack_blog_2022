const _ = require('lodash');
const { arraySet, copyPush } = require('./array_utils');

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

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }
  const authorsAndLikes = blogs.reduce((authorsArray, blog) => {
    //Find if author exists in array
    const authorIndex = authorsArray.findIndex(
      (author) => author.author === blog.author
    );
    return addAuthorOrLikes(authorsArray, blog, authorIndex);
  }, []);

  return authorsAndLikes.sort((a, b) => b.likes - a.likes)[0];
};

const createAuthor = (authorName, likes) => {
  return {
    author: authorName,
    likes,
  };
};

const addAuthorOrLikes = (authorsArray, blog, authorIndex) => {
  if (authorIndex !== -1) {
    //If author exists in array, create new Author object with new likes count
    authorsArray = arraySet(
      authorsArray,
      authorIndex,
      createAuthor(blog.author, authorsArray[authorIndex].likes + blog.likes)
    );
  } else {
    //If author doesn't exist in array, add new author object
    authorsArray = copyPush(
      authorsArray,
      createAuthor(blog.author, blog.likes)
    );
  }

  return authorsArray;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
