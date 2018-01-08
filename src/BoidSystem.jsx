import React from 'react';
import React3 from 'react-three-renderer';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import { magnitude, limit } from './utility/VectorUtility'

let idCounter = 0;
const maxSpeed = 0.003;
const maxForce = 0.00003;
let systemPosition = new THREE.Vector3();
class Boid {
  constructor (v) {
    this.id = idCounter++;
    this.position = v ? v.clone() : new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.color = new THREE.Color();
  }

  run (others) {
    this.flock(others);
    this.update();
    //this.applyBorders();
  }

  flock (others) {
    const idle = this.idle();
    const sep = this.separate(others);
    const align = this.align(others);
    const coh = this.cohesion(others);
    sep.multiplyScalar(1.5);
    align.multiplyScalar(1.0);
    coh.multiplyScalar(1.0);
    this.applyForce(idle);
    this.applyForce(sep);
    this.applyForce(align);
    this.applyForce(coh);
  }

  idle () {
    const t = Math.round(Date.now() / 1000);
    const r = 3.0;
    const nx = Math.round((r * Math.cos(t)) * 10) / 10
    const ny = Math.round((r * Math.sin(t)) * 10) / 10;
    return new THREE.Vector3(nx, ny, 0);
  }

  // calculate steering force towards a desired target
  seek (target) {
    // vector pointing from this position to target
    let desired = target.clone().sub(this.position);
    desired.normalize();
    desired.multiplyScalar(maxSpeed);

    let steer = desired.clone().sub(this.velocity);
    steer = limit(steer, maxForce);
    return steer;
  }

  separate (others) {
    const desiredSep = 0.6;

    let steer = new THREE.Vector3();
    let count = 0;

    for (let i = 0; i < others.length; ++i) {
      const other = others[i];
      const d = this.position.distanceTo(other.position);
      if ((d > 0) && (d < desiredSep)) {
        // vector pointing away from neighbor
        const dif = this.position.clone().sub(other.position);
        dif.normalize();
        dif.divideScalar(d);
        steer.add(dif);
        count++;
      }
    }

    // average
    if (count > 0) {
      steer.divideScalar(count);
    }

    // steering = desired - velocity
    if (magnitude(steer) > 0.0) {
      steer.normalize();
      steer.multiplyScalar(maxSpeed);
      steer.sub(this.velocity);
      steer = limit(steer, maxForce);
    }

    return steer;
  }

  // calculate avg velocity for other boids
  align (others) {
    const neighborDist = 1.2;
    let sum = new THREE.Vector3();

    let count = 0;

    for (let i = 0; i < others.length; ++i) {
      const other = others[i];
      const d = this.position.distanceTo(other.position);
      if ((d > 0) && (d < neighborDist)) {
        sum.add(other.velocity);
        count++;
      }
    }

    if (count > 0) {
      sum.divideScalar(count);

      sum.normalize();
      sum.multiplyScalar(maxSpeed);
      let steer = sum.clone();
      steer.sub(this.velocity);
      steer = limit(steer, this.velocity);
      return steer;
    }

    else {
      return new THREE.Vector3();
    }
  }

  cohesion (others) {
    const neighborDist = 1.2;

    let sum = new THREE.Vector3();
    let count = 0;

    for (let i = 0; i < others.length; ++i) {
      const other = others[i];
      const d = this.position.distanceTo(other.position);
      if ((d > 0) && (d < neighborDist)) {
        sum.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      sum.divideScalar(count);
      //return this.seek(sum);
      return this.seek(systemPosition);
    }

    else return new THREE.Vector3();
  }

  applyForce (force) {
    this.acceleration.add(force);
  }

  update () {
    this.velocity.add(this.acceleration);
    this.velocity = limit(this.velocity, maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.multiplyScalar(0.0);
  }

  applyBorders () {
    if (this.position.x < -1.0) this.velocity.x *= -1.0;
    if (this.position.y < -1.0) this.velocity.y *= -1.0;
    if (this.position.z < -1.0) this.velocity.z *= -1.0;
    if (this.position.x >  1.0) this.velocity.x *= -1.0;
    if (this.position.y >  1.0) this.velocity.y *= -1.0;
    if (this.position.z >  1.0) this.velocity.z *= -1.0;
  }
};

class Flock {
  constructor (boids) {
    this.boids = boids.slice();
  }

  run () {
    this.boids.forEach(b => {
      const others = this.boids.filter(o => b.id !== o.id);
      b.run(others);
    })
  }

  update () {
    this.boids.forEach(b => b.update());
  }
};

class BoidSystem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {ready: false};

    const { particleCount, radius } = props;

    this.particles = [];

    this.positions = [];
    this.colors = [];

    let color = new THREE.Color();

    for (let i = 0; i < particleCount; ++i) {
      const pos = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      this.particles.push(new Boid(pos));

      this.positions.push((Math.random() * 2 - 1) * radius);
      this.positions.push((Math.random() * 2 - 1) * radius);
      this.positions.push((Math.random() * 2 - 1) * radius);

      color.setHSL(i / particleCount, 1.0, 0.5);
      this.colors.push(color.r, color.g, color.b);
    }

    this.flock = new Flock(this.particles);
  }

  componentDidMount () {
    this.setState({ ready: true });
  }

  componentWillReceiveProps () {
    systemPosition = this.props.position;
    if (this.state.ready) {
      this.flock.run();
    }
  }

  componentWillUpdate () {
    if (this.state.ready) {
      this.flock.update();

      for (let i = 0; i < this.particles.length; ++i) {
        let positionIndex = i * 3;
        const particle = this.particles[i];
        this.positions[positionIndex] = particle.position.x;
        this.positions[positionIndex + 1] = particle.position.y;
        this.positions[positionIndex + 2] = particle.position.z;
      }
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

BoidSystem.propTypes = {
  particleCount: PropTypes.number,
  radius: PropTypes.number,
  particleMaterial: PropTypes.element,
  position: PropTypes.instanceOf(THREE.Vector3),
  rotation: PropTypes.instanceOf(THREE.Euler)
};

BoidSystem.defaultProps = {
  particleCount: 100,
  radius: 3,
  particleMaterial: (<materialResource resourceId="particleMaterial" />),
  position: new THREE.Vector3(),
  rotation: new THREE.Euler()
};

export default BoidSystem;
