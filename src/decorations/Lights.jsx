import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

/*
 *
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
 */

const Lights = ({ positions }) => {
  const pointLights = positions.map((pos, i) => (
    <pointLight
      key={i}
      position={pos}
      color={0xffffff}
      intensity={1}
      distance={0} />
  ));

  return (
    <group>
      {pointLights}
    </group>
  );
};

Lights.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.instanceOf(THREE.Vector3)),
};

export default Lights;
