import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import getDisplayName from 'react-display-name';

const withRenderable = (WrappedComponent) => {
  class WithRenderable extends React.PureComponent {
    render () {
      const {
        group,
        mesh,
        geometry,
        hoverHighlightGeometry
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
            <meshLambertMaterial
              color={color} />
          </mesh>
          {hoverHighlightMesh}
        </group>
      );
    };
  };

  WithRenderable.PropTypes = {
  };

  WithRenderable.displayName =
   `WithRenderable (${getDisplayName(WrappedComponent)})`;

  return WithRenderable;

};

export default withRenderable;
