import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

class Mesh extends React.PureComponent {

  _ref = (mesh) => {
    const {
      onCreate
    } = this.props;

    onCreate(mesh);
  };

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
      hoverHighlightMesh
    } = this.props;

    return (
      <group
        position={position}
        rotation={rotation}
        scale={scale}>
        <mesh
          castShadow
          receiveShadow

          onMouseEnter={onMouseEnter}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}

          ref={this._ref}>
          {geometry}
          {material}
        </mesh>
        {hoverHighlightMesh}
      </group>
    );
  }
}

Mesh.PropTypes = {
  geometry: PropTypes.element.isRequired,
  material: PropTypes.element.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onCreate: PropTypes.func
};

export default Mesh;
