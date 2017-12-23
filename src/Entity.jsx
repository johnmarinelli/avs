import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

class Entity extends React.PureComponent {

  _ref = (mesh) => {
    const {
      onCreate
    } = this.props;

    onCreate(mesh);
  };

  _update = (delta) => {
    console.log(delta);
  }

  render () {
    const {
      geometry,
      material,
      onMouseEnter,
      onMouseDown,
      onMouseLeave,
      position,
      rotation,
      scale,

      withHoverable = {},
      withDraggable = {}
    } = this.props;

    return (
      <group
        position={position}
        rotation={rotation}
        scale={scale}>
        <mesh
          castShadow
          receiveShadow

          onMouseEnter={withHoverable.onMouseEnter}
          onMouseDown={withDraggable.onMouseDown}
          onMouseLeave={withHoverable.onMouseLeave}

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

Entity.defaultProps = {
  onCreate: () => {}
}

export default Entity;
