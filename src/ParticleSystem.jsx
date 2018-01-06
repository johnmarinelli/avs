import React from 'react';
import React3 from 'react-three-renderer';
import PropTypes from 'prop-types';
import * as THREE from 'three';

class ParticleSystem extends React.Component {
  constructor (props) {
    super(props);

    const { particleCount, radius } = props;

    let positions = [],
      colors = [],
      sizes = [];

    let color = new THREE.Color();

    for (let i = 0; i < particleCount; ++i) {
      positions.push((Math.random() * 2 - 1) * radius);
      positions.push((Math.random() * 2 - 1) * radius);
      positions.push((Math.random() * 2 - 1) * radius);

      color.setHSL(i / particleCount, 1.0, 0.5);
      colors.push(color.r, color.g, color.b);

      sizes.push(20);
    }

    this.geometry = (
      <bufferGeometry
        index={null}
        position={new THREE.Float32BufferAttribute(positions.slice(), 3)}
        color={new THREE.Float32BufferAttribute(colors.slice(), 3)} />
    );

    this.material = (
      <materialResource
        resourceId="particleMaterial" />
    );
  }

  render () {
    return (
      <points>
        {this.geometry}
        {this.material}
      </points>
    );
  }
};

ParticleSystem.propTypes = {
  particleCount: PropTypes.number,
  radius: PropTypes.number,
  particleMaterial: PropTypes.element
};

ParticleSystem.defaultProps = {
  particleCount: 1800,
  radius: 10,
  particleMaterial: (<materialResource resourceId="particleMaterial" />)
};

export default ParticleSystem;
