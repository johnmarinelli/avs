import React from 'react';
import * as THREE from 'three';

class Resources extends React.Component {
  render () {
    return (
      <resources>
        <shaderMaterial
          resourceId="particleMaterial"
          vertexShader={document.getElementById('particleVertexShader2').textContent}
          fragmentShader={document.getElementById('particleFragmentShader2').textContent}
          blending={THREE.NormalBlending}
          depthTest={false}
          transparent={true}
          vertexColors={THREE.VertexColors}
          uniforms={{
            perspectiveMatrix: {
              value: new THREE.Matrix4()
            },

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
