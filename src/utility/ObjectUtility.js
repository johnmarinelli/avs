const compareObjects = (objA, objB) => {
  for (let p in objA) {
    if (objA.hasOwnProperty(p) !== objB.hasOwnProperty(p)) return false;
    switch (typeof objA[p]) {
      case 'object':
        if (!compareObjects(objA[p], objB[p])) return false;
        break;

      case 'function':
        if (typeof (objB[p]) === 'undefined' ||
            (objA[p].toString() !== objB[p].toString())) return false;

      default:
        if (objA[p] !== objB[p]) return false;
    }
  }

  for (let p in objB) {
    if (typeof (objA[p]) === 'undefined') return false;
  }
  return true;
};

export {
  compareObjects
};
