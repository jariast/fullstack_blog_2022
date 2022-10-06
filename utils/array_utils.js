const arraySet = (array, idx, value) => {
  let copy = array.slice();
  copy[idx] = value;
  return copy;
};

const copyPush = (array, elem) => {
  let copy = array.slice();
  copy.push(elem);
  return copy;
};

module.exports = { arraySet, copyPush };
