import React from 'react';
import * as THREE from 'three';

class Resources extends React.Component {
  render () {
    return (
      <resources>
        <shaderMaterial
          resourceId="particleMaterial"
          vertexShader={document.getElementById('vertexShader').textContent}
          fragmentShader={document.getElementById('fragmentShader').textContent}
          blending={THREE.AdditiveBlending}
          depthTest={false}
          transparent={true}
          vertexColors={THREE.FaceColors}
          uniforms={
            {
              texture: {
                value: new THREE.TextureLoader().load('particle.png')
              }
            }}
        />
        <boxGeometry
          resourceId="cube"

          width={0.5}
          height={0.5}
          depth={0.5}

          widthSegments={10}
          heightSegments={10} />

        <icosahedronGeometry
          resourceId="icosahedron"
          radius={0.5}
          detail={0} />

        <lineBasicMaterial
          resourceId="lineMaterial"
          color={0xff00ff} />

        <meshPhongMaterial
          resourceId="greyPhongMaterial"
          color={0x888888} />

        <meshLambertMaterial
          resourceId="greyLambertMaterial"
          color={0x888888} />

        <meshBasicMaterial
          resourceId="highlightMaterial"
          color={0xffff00}
          wireframe />
      </resources>
    );
  }
};

export default Resources;
