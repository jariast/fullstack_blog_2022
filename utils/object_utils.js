const objectSet = (object, key, value) => {
  let copy = Object.assign({}, object);
  copy[key] = value;
  return copy;
};

module.exports = { objectSet };
