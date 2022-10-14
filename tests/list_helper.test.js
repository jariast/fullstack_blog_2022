const listHelper = require('../utils/list_helper');
const {
  listWithOneBlog,
  listWithSeveralBlogs,
} = require('../utils/test_helpers');

test('dummy returns one', () => {
  const blogs = [];

  expect(listHelper.dummy(blogs)).toBe(1);
});

describe('total likes', () => {
  test('Empty list, should return 0', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test('Single blog, should return its likes', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5);
  });

  test('List with several blogs, should return the sum of all blogs likes', () => {
    expect(listHelper.totalLikes(listWithSeveralBlogs)).toBe(36);
  });
});

describe('favorite blog', () => {
  test('Empty blog list should return null', () => {
    expect(listHelper.favoriteBlog([])).toBeNull();
  });

  test('Single blog list, should return blog', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(
      listWithOneBlog[0]
    );
  });

  test('List with several blogs, should return fav blog', () => {
    expect(listHelper.favoriteBlog(listWithSeveralBlogs)).toEqual(
      listWithSeveralBlogs[2]
    );
  });
});

describe('prolific author', () => {
  test('Empty blog list should return null', () => {
    expect(listHelper.mostBlogs([])).toBeNull();
  });

  test('Single blog list, should return that blog author and blog count should be 1', () => {
    const expectedAuthor = { author: 'Edsger W. Dijkstra', blogs: 1 };
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual(expectedAuthor);
  });

  test('Several blogs list should return author with most blogs and with appropiate blog count', () => {
    const expectedAuthor = { author: 'Robert C. Martin', blogs: 4 };
    expect(listHelper.mostBlogs(listWithSeveralBlogs)).toEqual(expectedAuthor);
  });
});

describe('most liked author', () => {
  test('Empty blog list should return null', () => {
    expect(listHelper.mostLikes([])).toBeNull();
  });

  test('Single blog list, should return that blog author and likes', () => {
    const expectedAuthor = { author: 'Edsger W. Dijkstra', likes: 5 };
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual(expectedAuthor);
  });

  test('Several blogs list, should return author with most likes', () => {
    const expectedAuthor = { author: 'Edsger W. Dijkstra', likes: 17 };
    expect(listHelper.mostLikes(listWithSeveralBlogs)).toEqual(expectedAuthor);
  });
});
