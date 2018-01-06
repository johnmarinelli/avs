import React from 'react';
import PropTypes from 'prop-types';
import { Vector3, Euler, perspectiveCamera } from 'three';

const Camera = ({
  cameraName,
  aspect,
  position,
  rotation,
  setRef,
  fov,
  near,
  far
}) =>(
  <perspectiveCamera
    name={cameraName}
    ref={camera => setRef(camera)}
    fov={fov}
    aspect={aspect}
    near={near}
    far={far}

    position={position}
    rotation={rotation} />
);

Camera.propTypes = {
  cameraName: PropTypes.string.isRequired,
  position: PropTypes.instanceOf(Vector3).isRequired,
  rotation: PropTypes.instanceOf(Euler).isRequired,
  fov: PropTypes.number,
  near: PropTypes.number,
  far: PropTypes.number,
  setRef: PropTypes.func
};

Camera.defaultProps = {
  fov: 70,
  near: 0.5,
  far: 10000
};

export default Camera;
