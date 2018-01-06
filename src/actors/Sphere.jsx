import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import { rgbToHex } from '../utility/ColorUtility';
import { compareObjects } from '../utility/ObjectUtility';

import Entity from './Entity';
import Compose from '../services/Compose'
import { withHoverable, withDraggable } from '../services/enhancers/'

const HoverableEntity = Compose(
  withHoverable
)(Entity);

class Sphere extends React.PureComponent {

  constructor () {
    super();

    this.sphereGeometry = new THREE.SphereGeometry(15, 20, 20, 0, 6.28, 0, 3.14);

    this.state = ({
      vertices: this.sphereGeometry.vertices.slice(),
      faces: this.sphereGeometry.faces.slice()
    });
  }

  componentWillReceiveProps (nextProps) {
    const { offset } = nextProps;

    if (offset !== this.props.offset) {
      const vertices = this.state.vertices.slice();

      const d = Math.sin(offset).toFixed(2);

      for (let i = 1; i < vertices.length / 2; i+=2) {
        const { x, y, z } = vertices[i];
        vertices[i].set(x, y + (d / 2), z);
      }

      this.setState({ vertices });
    }
  }

  shouldComponentUpdate (newProps) {
    if (newProps.camera !== this.props.camera ||
        newProps.offset !== this.props.offset ||
        newProps.color.red !== this.props.color.red ||
        newProps.color.green !== this.props.color.green ||
        newProps.color.blue !== this.props.color.blue) return true;
    else return false;
  }

  render () {
    const { vertices, faces } = this.state;
    const { position, rotation, scale, camera, mouseInput } = this.props;

    console.log(camera)

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
      <HoverableEntity
        geometry={geometry}
        material={sphereMaterial}
        position={position}
        scale={scale}
        rotation={rotation} />
    );
  }
};

Sphere.propTypes = {
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  rotation: PropTypes.instanceOf(THREE.Euler),
  scale: PropTypes.instanceOf(THREE.Vector3),
  color: PropTypes.object
};

Sphere.defaultProps = {
  rotation: new THREE.Euler(0, 0, 0),
  scale: new THREE.Vector3(1, 1, 1),
  color: { red: 21, green: 98, blue: 137 }
};

export default Sphere;
