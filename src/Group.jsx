import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import getDisplayName from 'react-display-name';

class Group extends React.PureComponent {
  render () {
    const {
      position,
      rotation,
      scale,
      children
    } = this.props;

    return (
      <group
        position={position}
        rotation={rotation}
        scale={scale}>
        {children}
      </group>
    );
  }
};

Group.PropTypes = {
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  rotation: PropTypes.instanceOf(THREE.Vector3).isRequired,
  scale: PropTypes.instanceOf(THREE.Vector3).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

Group.defaultProps = {
  position: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0),
  scale: new THREE.Vector3(1, 1, 1)
};

export default Group;
