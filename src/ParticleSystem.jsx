import React from 'react';
import React3 from 'react-three-renderer';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import { magnitude, limit } from './utility/VectorUtility'

let idCounter = 0;
const maxSpeed = 0.03;
const maxForce = 0.0003;
class Particle {
  constructor (pos = new THREE.Vector3(), vel = new THREE.Vector3(), col = new THREE.Color()) {
    this.id = idCounter++;
    this.position = pos.clone();
    this.velocity = vel.clone();
    this.color = col.clone();
    this.acceleration = new THREE.Vector3();
  }
};

class Particles {
  constructor (particles) {
    this.particles = particles.slice();
  }

  run () {
    this.particles.forEach(b => {
      const others = this.particles.filter(o => b.id !== o.id);
      b.run(others);
    })
  }

  update () {
    this.particles.forEach(b => b.update());
  }
};

class ParticleSystem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {ready: false};

    const { particleCount, radius } = props;

    this.particles = new Array(particleCount);
    this.positions = new Array(particleCount * 3);
    this.colors = new Array(particleCount * 3);
  }

  componentDidMount () {
    const { particleCount } = this.props;

    for (let i = 0; i < particleCount; ++i) {
      //const pos = new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10);
      const pos = new THREE.Vector3();
      const vel =  new THREE.Vector3(
        (Math.random() * 2 - 1)*.05,
        (Math.random() * 2 - 1)*.05,
        .93 + Math.random()*.02
      );
      const color = new THREE.Color().setHSL(i / particleCount, Math.random(), Math.random());

      this.particles[i] = new Particle(pos, vel, color);
    }
  }

  componentWillReceiveProps (newProps) {
    const { particleCount } = this.props;

    const ratio = window.innerWidth / window.innerHeight;
    let p, bp;

    for (let i = 0; i < particleCount; i+=2 ) {
      const particle = this.particles[i];
      const nextParticle = this.particles[i + 1];

      const { position, velocity } = particle;
      const nextPosition = nextParticle.position,
        nextVelocity = nextParticle.velocity;

      bp = i*3;

      position.x = nextPosition.x;
      position.y = nextPosition.y;

      velocity.x *= velocity.z;
      velocity.y *= velocity.z;

      p = nextPosition.x;
      p += velocity.x;

      if (p < -ratio) {
        p = -ratio;
        velocity.x = Math.abs(velocity.x);
      }
      else if (p > ratio) {
        p = ratio;
        velocity.x = -Math.abs(velocity.x);
      }
      nextPosition.x = p;

      p = nextPosition.y;
      p += velocity.y;

      if (p < -1) {
        p = -1;
        velocity.y = Math.abs(velocity.y);
      }
      else if (p > 1) {
        p = 1;
        velocity.y = -Math.abs(velocity.y);
      }
      nextPosition.y = p;

      /*
      var dx = touchX - vertices[bp],
          dy = touchY - vertices[bp+1],
          d = Math.sqrt(dx * dx + dy * dy);
          if ( d < 2 )
          {
            if ( d < .03 )
            {
              vertices[bp+3] = (Math.random() * 2 - 1)*ratio;
              vertices[bp+4] = Math.random() * 2 - 1;
              velocities[bp] = 0;
              velocities[bp+1] = 0;
            } else {
              dx /= d;
              dy /= d;
              d = ( 2 - d ) / 2;
              d *= d;
              velocities[bp] += dx * d * .01;
              velocities[bp+1] += dy * d * .01;
            }
          }
      */
    }
  }

  componentWillUpdate (newProps) {
    const { particleCount } = this.props;

    for (let i = 0; i < particleCount; ++i) {
      const particle = this.particles[i];
      const positionIndex = i * 3;
      const { x, y, z } = particle.position;
      const { r, g, b } = particle.color;

      this.positions[positionIndex] = x;
      this.positions[positionIndex + 1] = y;
      this.positions[positionIndex + 2] = z;

      this.colors[positionIndex] = r;
      this.colors[positionIndex + 1] = g;
      this.colors[positionIndex + 2] = b;
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
  radius: 50,
  particleMaterial: (<materialResource resourceId="particleMaterial" />),
  position: new THREE.Vector3(),
  rotation: new THREE.Euler()
};

export default ParticleSystem;
