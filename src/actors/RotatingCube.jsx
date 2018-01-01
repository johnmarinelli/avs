import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import Entity from './Entity';
import Compose from '../services/Compose';
import { withHoverable, withDraggable  } from '../services/enhancers';

const HoverableDraggableEntity = Compose(
  withDraggable,
  withHoverable
)(Entity);

class RotatingCube extends React.Component {

  constructor () {
    super();
    this.geometry =
      <geometryResource
        resourceId="cube" />;

    this.material =
      <materialResource
        resourceId="cubeMaterial" />;

    this.scale = new THREE.Vector3(1, 1, 1).multiplyScalar(0.5);
  }

  render () {
    const {
      index,

      position,
      quaternion,

      cursor,
      camera,
      mouseInput,

      onDragStart,
      onDragEnd
    } = this.props;

    this.rotation = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');

    return (
      <HoverableDraggableEntity
        index={index}
        material={this.material}
        geometry={this.geometry}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}

        cursor={cursor}
        camera={camera}
        mouseInput={mouseInput}

        scale={this.scale}
        rotation={this.rotation}
        position={position} />
    );
  }
}

RotatingCube.propTypes = {
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  quaternion: PropTypes.instanceOf(THREE.Quaternion).isRequired
};

export default RotatingCube;
