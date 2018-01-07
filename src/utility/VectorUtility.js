import * as THREE from 'three';

const magnitude = (v) => Math.sqrt(Math.pow(v.x, 2.0), Math.pow(v.y, 2.0), Math.pow(v.z, 2.0));
const limit = (v, l) => {
  let vv = v.clone();
  if (magnitude(vv) > l) {
    vv.normalize();
    vv.multiplyScalar(l);
  }
  return vv;
}

export {
  magnitude,
  limit
};
