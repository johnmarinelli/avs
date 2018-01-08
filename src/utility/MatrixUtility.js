import * as THREE from 'three';

const createPerspectiveMatrix = (nearPlane, farPlane, fieldOfView, aspectRatio) => {
    let top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
    let bottom = -top;
    let right = top * aspectRatio;
    let left = -right;

    //     Create the perspective matrix. The OpenGL function that's normally used for this,
    //     glFrustum() is not included in the WebGL API. That's why we have to do it manually here.
    //     More info: http://www.cs.utk.edu/~vose/c-stuff/opengl/glFrustum.html
    let a = (right + left) / (right - left);
    let b = (top + bottom) / (top - bottom);
    let c = (farPlane + nearPlane) / (farPlane - nearPlane);
    let d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
    let x = (2 * nearPlane) / (right - left);
    let y = (2 * nearPlane) / (top - bottom);
    let perspectiveMatrix = [
      x, 0, a, 0,
      0, y, b, 0,
      0, 0, c, d,
      0, 0, -1, 0
    ];

  let m = new THREE.Matrix4();
  new THREE.Matrix4().set.apply(m, perspectiveMatrix);
  return m;
};

export {
  createPerspectiveMatrix
};
