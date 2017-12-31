import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

class Entity extends React.PureComponent {

  _ref = (mesh) => {
    const {
      onCreate
    } = this.props;

    if (onCreate) {
      onCreate(mesh);
    }
  };

  render () {
    const {
      geometry,
      material,
      position,
      rotation,
      scale,

      onMouseEnter,
      onMouseLeave,

      withHoverable = {},
      withDraggable = {}
    } = this.props;

    const _onMouseEnter = (e) => {
      if (withHoverable.onMouseEnter) {
        withHoverable.onMouseEnter(e);
      }
      if (onMouseEnter) {
        onMouseEnter(e);
      }
    };

    const _onMouseLeave = (e) => {
      if (withHoverable.onMouseLeave) {
        withHoverable.onMouseLeave(e);
      }
      if (onMouseLeave) {
        onMouseLeave(e);
      }
    };

    return (
      <group
        position={position}
        rotation={rotation}
        scale={scale}>
        <mesh
          castShadow
          receiveShadow

          onMouseEnter={_onMouseEnter}
          onMouseDown={withDraggable.onMouseDown}
          onMouseLeave={_onMouseLeave}

          ref={this._ref}>
          {geometry}
          {material}
        </mesh>
        {withHoverable.hoverHighlightMesh}
      </group>
    );
  }
}

Entity.PropTypes = {
  geometry: PropTypes.element.isRequired,
  material: PropTypes.element.isRequired,
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  scale: PropTypes.instanceOf(THREE.Vector3).isRequired,
  rotation: PropTypes.instanceOf(THREE.Euler).isRequired,
  onMouseEnter: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onCreate: PropTypes.func
};

export default Entity;
