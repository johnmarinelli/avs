import React from 'react';
import * as THREE from 'three';

class Resources extends React.Component {
  render () {
    return (
      <resources>
        <sphereGeometry
          resourceId="sphere"
          radius={10} />

        <boxGeometry
          resourceId="cube"

          width={0.5}
          height={0.5}
          depth={0.5}

          widthSegments={10}
          heightSegments={10} />

        <lineBasicMaterial
          transparent={true}
          opacity={0.5}
          resourceId="lineMaterial"
          color={0xffffff} />

        <meshPhongMaterial
          resourceId="sphereMaterial"
          color={0x156289}
          emissive={0x072534}
          side={THREE.DoubleSide}
          shading={THREE.FlatShading} />

        <meshPhongMaterial
          resourceId="cubeMaterial"
          color={0x888888} />

        <meshBasicMaterial
          resourceId="wireframeMaterial"
          color={0xffff00}
          wireframe />
      </resources>
    );
  }
};

export default Resources;
