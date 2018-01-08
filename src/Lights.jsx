import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

const Lights = ({ position, lookAt, shadowDis }) => (
  <group>
    {/*
    <ambientLight
      color={0x666666} />

    <directionalLight
      color={0xffffff}
      intensity={1.75}

      castShadow

      shadowMapWidth={1024}
      shadowMapHeight={1024}

      shadowCameraLeft={-shadowDis}
      shadowCameraRight={shadowDis}
      shadowCameraTop={shadowDis}
      shadowCameraBottom={-shadowDis}

      shadowCameraFar={3 * shadowDis}
      shadowCameraNear={shadowDis}

      position={position}
      lookAt={lookAt} />
    */}
  </group>
);

Lights.propTypes = {
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  lookAt: PropTypes.instanceOf(THREE.Vector3).isRequired,
  shadowDis: PropTypes.number
};

Lights.defaultProps = {
  shadowDis: 20
};

export default Lights;
