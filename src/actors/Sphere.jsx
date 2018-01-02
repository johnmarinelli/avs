import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

class Sphere extends React.PureComponent {

  setGeometry = () => {
    const { vertices, faces } = this.state;

    this.geometry = (
      <geometry
        faces={faces}
        vertices={vertices} />
    );

    this.wireframeMesh = (
      <mesh
        ignorePointerEvents>
        {this.geometry}
        <materialResource
          resourceId="wireframeMaterial" />
      </mesh>
    );

    this.mesh = (
      <mesh>
        {this.geometry}
        <materialResource
          resourceId="sphereMaterial" />
      </mesh>
    );
  };

  constructor () {
    super();

    this.sphereGeometry = new THREE.SphereGeometry(15, 8, 6, 0, 6.28, 0, 3.14);

    this.state = ({
      vertices: this.sphereGeometry.vertices.slice(),
      faces: this.sphereGeometry.faces.slice()
    });

    this.geometry = null;

    this.scale = new THREE.Vector3(
      1,
      1,
      1
    );
  }

  componentWillMount () {
    this.setGeometry();
  }

  componentWillReceiveProps (nextProps) {
    const { time } = nextProps;
    const vertices = this.state.vertices.slice();

    const d = Math.sin(time).toFixed(2);

    for (let i = 1; i < vertices.length / 2; i+=2) {
      const { x, y, z } = vertices[i];
      vertices[i].set(x, y + (d / 2), z);
    }

    this.setState({ vertices });
  }

  shouldComponentUpdate (newProps) {
    if (newProps.time !== this.props.time) return true;
    else return false;
  }

  render () {
    const { vertices, faces } = this.state;
    const { position, rotation } = this.props;

    const geometry =
      <geometry
        faces={faces}
        vertices={vertices} />;

    const wireframeMesh =
      <mesh
        ignorePointerEvents>
        {geometry}
        <materialResource
          resourceId="wireframeMaterial" />
      </mesh>

    const mesh =
      <mesh>
        {geometry}
        <materialResource
          resourceId="sphereMaterial" />
      </mesh>;

    return (
      <group
        position={position}
        rotation={rotation}
        scale={this.scale}>
        {wireframeMesh}
        {mesh}
      </group>
    );
  }
};

Sphere.propTypes = {
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  rotation: PropTypes.instanceOf(THREE.Euler)
};

export default Sphere;
