import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

const Line = ({ points }) => {
  const geometry = (
    <geometry
      vertices={points} />
  );

  const material = (
    <materialResource
      resourceId="lineMaterial" />
  );

  return (
    <line>
      {geometry}
      {material}
    </line>
  );
};

Line.propsTypes = {
  points: PropTypes.arrayOf(PropTypes.instanceOf(THREE.Vector3))
};

export default Line;
