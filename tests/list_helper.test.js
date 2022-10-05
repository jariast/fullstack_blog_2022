const listHelper = require('../utils/list_helper');
const testHelper = require('../utils/test_helpers');

test('dummy returns one', () => {
  const blogs = [];

  expect(listHelper.dummy(blogs)).toBe(1);
});

describe('total likes', () => {
  test('Empty list, should return 0', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test('Single blog, should return its likes', () => {
    expect(listHelper.totalLikes(testHelper.listWithOneBlog)).toBe(5);
  });

  test('List with several blogs, should return the sum of all blogs likes', () => {
    expect(listHelper.totalLikes(testHelper.listWithSeveralBlogs)).toBe(36);
  });
});

describe('favorite blog', () => {
  test('Empty blog list should return null', () => {
    expect(listHelper.favoriteBlog([])).toBeNull();
  });

  test('Single blog list, should return blog', () => {
    expect(listHelper.favoriteBlog(testHelper.listWithOneBlog)).toEqual(
      testHelper.listWithOneBlog[0]
    );
  });

  test('List with several blogs, should return fav blog', () => {
    expect(listHelper.favoriteBlog(testHelper.listWithSeveralBlogs)).toEqual(
      testHelper.listWithSeveralBlogs[2]
    );
  });
});
