import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import { rgbToHex } from '../utility/ColorUtility';

class Sphere extends React.PureComponent {

  constructor () {
    super();

    this.sphereGeometry = new THREE.SphereGeometry(15, 20, 20, 0, 6.28, 0, 3.14);

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

  componentWillReceiveProps (nextProps) {
    const { offset } = nextProps;
    const vertices = this.state.vertices.slice();

    const d = Math.sin(offset).toFixed(2);

    for (let i = 1; i < vertices.length / 2; i+=2) {
      const { x, y, z } = vertices[i];
      vertices[i].set(x, y + (d / 2), z);
    }

    this.setState({ vertices });
  }

  shouldComponentUpdate (newProps) {
    if (newProps.offset !== this.props.offset) return true;
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
      </mesh>;

    const { color: { red, green, blue } }= this.props;
    const hexColor = rgbToHex(red, green, blue);

    const sphereMaterial =
        <meshPhongMaterial
          color={hexColor}
          emissive={0x072534}
          side={THREE.DoubleSide}
          shading={THREE.FlatShading} />;

    const mesh =
      <mesh>
        {geometry}
        {sphereMaterial}
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
  rotation: PropTypes.instanceOf(THREE.Euler),
  color: PropTypes.object
};

Sphere.defaultProps = {
  rotation: new THREE.Euler(0, 0, 0),
  color: { red: 21, green: 98, blue: 137 }
};

export default Sphere;
