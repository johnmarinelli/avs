import React from 'react';
import React3 from 'react-three-renderer';
import PropTypes from 'prop-types';
import * as THREE from 'three';

class ParticleSystem extends React.Component {
  constructor (props) {
    super(props);

    const { particleCount, radius } = props;

    this.positions = [];
    this.colors = [];
    this.sizes = [];

    let color = new THREE.Color();

    for (let i = 0; i < particleCount; ++i) {
      this.positions.push((Math.random() * 2 - 1) * radius);
      this.positions.push((Math.random() * 2 - 1) * radius);
      this.positions.push((Math.random() * 2 - 1) * radius);

      color.setHSL(i / particleCount, 1.0, 0.5);
      this.colors.push(color.r, color.g, color.b);

      this.sizes.push(20);
    }
  }

  componentWillUpdate () {
    let x, y, z;
    const t = Date.now() * 0.005;

    for (let i = 0; i < this.props.particleCount * 3; i++) {
      this.positions[i] += Math.sin(t) * 0.1;
    }
  }

  render () {
    const { position, rotation } = this.props;

    return (
      <points
        position={position}
        rotation={rotation}>
        <bufferGeometry
          index={null}
          position={new THREE.Float32BufferAttribute(this.positions.slice(), 3)}
          color={new THREE.Float32BufferAttribute(this.colors.slice(), 3)} />
        <materialResource
          resourceId="particleMaterial" />
      </points>
    );
  }
};

ParticleSystem.propTypes = {
  particleCount: PropTypes.number,
  radius: PropTypes.number,
  particleMaterial: PropTypes.element,
  position: PropTypes.instanceOf(THREE.Vector3),
  rotation: PropTypes.instanceOf(THREE.Euler)
};

ParticleSystem.defaultProps = {
  particleCount: 500,
  radius: 1,
  particleMaterial: (<materialResource resourceId="particleMaterial" />),
  position: new THREE.Vector3(),
  rotation: new THREE.Euler()
};

export default ParticleSystem;
