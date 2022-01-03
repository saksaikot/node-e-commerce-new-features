function _pick(object, ...keys) {
  keys = keys.flat();
  const result = {};
  for (let key in object) {
    if (keys.includes(key)) {
      result[key] = object[key];
    }
  }
  return result;
}

function _unpick(object, ...keys) {
  keys = keys.flat();
  const result = {};
  for (let key in object) {
    if (!keys.includes(key)) {
      result[key] = object[key];
    }
  }
  return result;
}

module.exports = { _pick, _unpick };
