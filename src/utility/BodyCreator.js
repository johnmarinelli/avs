import * as THREE from 'three';

const createBody = () => {
  const position = new THREE.Vector3(
    -2.5 + Math.random() * 5,
    0.5 + Math.random() * 5,
    -2.5 + Math.random() * 5
  );

  const velocity = new THREE.Vector3(
    Math.random(),
    Math.random(),
    0.0
  );

  return {
    position,
    velocity,

    timeScale: Math.random() * 0.0005,
    startPosition: position.clone(),
    rotationDeltaPerFrame: new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        Math.random() * 0.05,
        Math.random() * 0.05,
        Math.random() * 0.05
      )),
    quaternion: new THREE.Quaternion()
  };
};


const createBodies = (n) => {
  let bodies = new Array(n);
  for (let i = 0; i < n; ++i) {
    bodies[i] = createBody();
  }
  return bodies;
};


export {
  createBodies
};

