import React from 'react';
import React3 from 'react-three-renderer';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import Stats from 'stats-js';

import MouseInput from './services/mouse-input';
import TrackballControls from './services/trackball';
import Entity from './Entity';
import Compose from './Compose';
import { withHoverable, withDraggable  } from './enhancers';

const scale = new THREE.Vector3(1, 1, 1).multiplyScalar(0.5);
const HoverableDraggableEntity = Compose(
  withDraggable,
  withHoverable
)(Entity);

class RotatingCube extends React.Component {
  render () {
    const {
      index,
      bodyRef,

      position,
      quaternion,

      cursor,
      camera,
      mouseInput,

      onDragStart,
      onDragEnd
    } = this.props;

    const geometry =
      <geometryResource
        resourceId="cube" />;

    const material =
      <materialResource
        resourceId="cubeMaterial" />;

    const rotation = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');

    return (
      <HoverableDraggableEntity
        index={index}
        material={material}
        geometry={geometry}
        onMouseEnter={_ => console.log('mouse enter')}
        onMouseLeave={_ => console.log('mouse leave')}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}

        cursor={cursor}
        camera={camera}
        mouseInput={mouseInput}

        bodyRef={bodyRef}

        scale={scale}
        rotation={rotation}
        position={position} />
    );
  }
}

RotatingCube.propTypes = {
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,
  quaternion: PropTypes.instanceOf(THREE.Quaternion).isRequired
};

class Animate extends React.Component {

  createBody (index) {
    const position = new THREE.Vector3(
      -2.5 + Math.random() * 5,
      0.5 + Math.random() * 5,
      -2.5 + Math.random() * 5
    );

    const velocity = new THREE.Vector3(
      Math.random(),
      Math.random(),
      0.0
    );

    return {
      position,
      velocity,

      timeScale: Math.random() * 0.0005,
      startPosition: position.clone(),
      movementPerFrame: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
      rotationDeltaPerFrame: new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
          Math.random() * 0.05,
          Math.random() * 0.05,
          Math.random() * 0.05
        )),
      quaternion: new THREE.Quaternion()
    };
  }

  createBodies () {
    const { bodies } = this;
    const N = bodies.length;

    for (let i = 0; i < N; ++i) {
      bodies[i] = this.createBody(i);
    }
  }

  getMeshStates () {
    return this.bodies.map(({position, quaternion}) => ({
      position: new THREE.Vector3().copy(position),
      quaternion: new THREE.Quaternion().copy(quaternion)
    }))
  }

  constructor (props, context) {
    super(props, context);
    const N = 20;

    this.fog = new THREE.Fog(0x001525, 10, 40);
    const d = 20;

    this.lightPosition = new THREE.Vector3(d, d, d);
    this.lightTarget = new THREE.Vector3(0, 0, 0);
    this.groundQuaternion = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

    const cameraPosition = new THREE.Vector3(10, 2, 0);
    const cameraRotation = new THREE.Euler();

    const bodies = new Array(N);

    this.bodies = bodies;

    this.createBodies();

    this.state = {
      cameraPosition,
      cameraRotation,
      mouseInput: null,
      numBodies: N,
      meshStates: this.getMeshStates()
    };

    this.cursor = {
      hovering: false,
      dragging: false
    };
  }

  onTrackballChange = () => {
    this.setState({
      cameraPosition: this.refs.camera.position.clone(),
      cameraRotation: this.refs.camera.rotation.clone()
    });
  };

  componentDidMount () {
    const {
      container,
      camera
    } = this.refs;

    const controls = new TrackballControls(camera);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = true;

    this.controls = controls;

    this.controls.addEventListener('change', this.onTrackballChange);

    this.stats = new Stats();

    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    container.appendChild(this.stats.domElement);
  }

  componentDidUpdate (newProps) {
    const {
      mouseInput
    } = this.refs;

    const {
      width,
      height
    } = this.props;

    if (width !== newProps.width || height !== newProps.height) {
      mouseInput.containerResized();
    }
  }

  onAnimate = () => {
    this.onAnimateInternal();

    this.updatePhysics();
    this.updateGraphics();
    this.stats.update();
    this.controls.update();
  }

  onAnimateInternal () {
    const {
      camera,
      mouseInput
    } = this.refs;

    if (!mouseInput.isReady()) {
      const {
        scene,
        container
      } = this.refs;

      mouseInput.ready(scene, container, camera);
      mouseInput.setActive(true);
    }

    if (this.state.mouseInput !== mouseInput) {
      this.setState({
        mouseInput
      })
    }

    if (this.state.camera !== camera) {
      this.setState({
        camera
      });
    }
  }

  updatePhysics () {
    const time = new Date().getTime();
    const bodies = this.bodies;

    for (let i = 0; i < bodies.length; ++i) {
      const body = bodies[i];

      body.quaternion.multiply(body.rotationDeltaPerFrame);

      const sinTime = Math.abs(Math.sin(time * body.timeScale));

      const { movementPerFrame } = body;
      /*
      const newPosition = body
        .startPosition
        .clone()
        .add(movementPerFrame.clone())
        .multiplyScalar(sinTime);
      */

      const newPosition = body.position.clone().add(body.velocity.clone().multiplyScalar(0.01));

      body.position.copy(newPosition);
    }
  }

  updateGraphics () {
    this.setState({
      meshStates: this.getMeshStates()
    });
  }

  onDragStart = (newPos, i) => {
    this.bodies[i].position = newPos;
  };

  onDragEnd = (newPos, i) => {
    this.bodies[i].position = newPos;
  };

  render () {
    const { cursor } = this;

    const {
      width,
      height
    } = this.props;

    const {
      meshStates,
      cameraPosition,
      cameraRotation,
      camera,
      mouseInput
    } = this.state;
    const d = 20;

    const cubeMeshes = meshStates.map(({position, quaternion}, i) => (
      <RotatingCube
        key={i}
        index={i}
        position={position}
        quaternion={quaternion}
        mouseInput={mouseInput}
        camera={camera}
        cursor={cursor}
        bodyRef={this.bodies[i]}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        />
    ));

    return (
      <div ref="container">
        <React3
          antialias
          mainCamera='camera'
          width={width}
          height={height}

          onAnimate={this.onAnimate}

          clearColor={this.fog.color}

          gammaInput
          gammaOutput
          shadowMapEnabled >

          <module
            ref="mouseInput"
            descriptor={MouseInput} />

          <resources>

            <boxGeometry
              resourceId="cube"

              width={0.5}
              height={0.5}
              depth={0.5}

              widthSegments={10}
              heightSegments={10} />

            <meshPhongMaterial
              resourceId="cubeMaterial"
              color={0x888888} />

            <meshBasicMaterial
              resourceId="highlightMaterial"
              color={0xffff00}
              wireframe />

          </resources>

          <scene
            ref="scene"
            fog={this.fog} >
            <perspectiveCamera
              name="camera"
              ref="camera"
              fov={70}
              aspect={width / height}
              near={0.5}
              far={10000}

              position={cameraPosition}
              rotation={cameraRotation} />

            <ambientLight
              color={0x666666} />

            <directionalLight
              color={0xffffff}
              intensity={1.75}

              castShadow

              shadowMapWidth={1024}
              shadowMapHeight={1024}

              shadowCameraLeft={-d}
              shadowCameraRight={d}
              shadowCameraTop={d}
              shadowCameraBottom={-d}

              shadowCameraFar={3 * d}
              shadowCameraNear={d}

              position={this.lightPosition}
              lookAt={this.lightTarget} />
            {cubeMeshes}
          </scene>
        </React3>
      </div>
    )
  }

  componentWillUnmount () {
    this.controls.removeEventListener('change', this.onTrackballChange);
    this.controls.dispose();
    delete this.controls;
    delete this.stats;
  }
}

export default Animate;
