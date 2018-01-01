import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

class Sphere extends React.PureComponent {

  constructor () {
    super();

    const sphereGeometry = new THREE.SphereGeometry(15, 8, 6, 0, 6.28, 0, 3.14);

    this.state = ({
      vertices: sphereGeometry.vertices.slice(),
      faces: sphereGeometry.faces.slice()
    });

    this.scale = new THREE.Vector3(
      1,
      1,
      1
    );
  }

  componentWillMount () {
    const { vertices, faces } = this.state;
    const geometry = (
      <geometry
        vertices={vertices}
        faces={faces} />
    );

    this.wireframeMesh = (
      <mesh
        ignorePointerEvents>
        {geometry}
        <materialResource
          resourceId="wireframeMaterial" />
      </mesh>
    );

    this.mesh = (
      <mesh>
        {geometry}
        <materialResource
          resourceId="sphereMaterial" />
      </mesh>
    );
  }

  render () {
    const { position, rotation } = this.props;
    return (
      <group
        position={position}
        rotation={rotation}
        scale={this.scale}>
        {this.wireframeMesh}
        {this.mesh}
      </group>
    );
  }
};

Sphere.propTypes = {
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  rotation: PropTypes.instanceOf(THREE.Euler)
};

export default Sphere;
