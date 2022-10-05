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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
