import React from 'react';
import React3 from 'react-three-renderer';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import Stats from 'stats-js';

import MouseInput from './services/mouse-input';
import TrackballControls from './services/trackball';
import RotatingCube from './RotatingCube';
import Line from './Line';
import Resources from './Resources';
import Lights from './Lights';
import Camera from './Camera';

import { createBodies } from './BodyCreator';

class Animate extends React.Component {
  getMeshStates () {
    return this.bodies.map(({position, quaternion}) => ({
      position: new THREE.Vector3().copy(position),
      quaternion: new THREE.Quaternion().copy(quaternion)
    }))
  }

  constructor (props, context) {
    super(props, context);

    this.fog = new THREE.Fog(0x001525, 10, 40);
    this.cameraName = "camera";

    this.lightPosition = new THREE.Vector3(20, 20, 20);
    this.lightTarget = new THREE.Vector3(0, 0, 0);

    const cameraPosition = new THREE.Vector3(10, 2, 0);
    const cameraRotation = new THREE.Euler();

    this.bodies = createBodies(20).slice();

    this.state = {
      cameraPosition,
      cameraRotation,
      linePoints: [new THREE.Vector3(), new THREE.Vector3()],
      mouseInput: null,
      meshStates: this.getMeshStates()
    };

    this.cursor = {
      hovering: false,
      dragging: false
    };

    this.refs = {
      camera: null,
      mouseInput: null
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
    const bodies = this.bodies;

    for (let i = 0; i < bodies.length; ++i) {
      const body = bodies[i];

      body.quaternion.multiply(body.rotationDeltaPerFrame);

      const newPosition = body
        .position.clone()
        .add(body.velocity.clone().multiplyScalar(0.01));

      body.position.copy(newPosition);
    }

    this.setState({
      linePoints: [
        bodies[0].position.clone(),
        bodies[5].position.clone()
      ]
    });
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

  setCameraRef (camera) {
    this.refs.camera = camera;
  }

  render () {
    const { cursor } = this;

    const {
      width,
      height
    } = this.props;

    const {
      meshStates,
      linePoints,
      cameraPosition,
      cameraRotation,
      camera,
      mouseInput
    } = this.state;

    const cubeMeshes = meshStates.map(({position, quaternion}, i) => (
      <RotatingCube
        key={i}
        index={i}
        position={position}
        quaternion={quaternion}
        mouseInput={mouseInput}
        camera={camera}
        cursor={cursor}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        />
    ));

    const line = (
      <Line
        points={linePoints} />
    );

    return (
      <div ref="container">
        <React3
          antialias
          mainCamera={this.cameraName}
          width={width}
          height={height}

          onAnimate={this.onAnimate}

          clearColor={this.fog.color}

          shadowMapEnabled >

          <module
            ref="mouseInput"
            descriptor={MouseInput} />

          <Resources />

          <scene
            ref="scene"
            fog={this.fog} >

            <Camera
              cameraName={this.cameraName}
              aspect={width / height}
              position={cameraPosition}
              rotation={cameraRotation}
              setRef={this.setCameraRef.bind(this)} />

            <Lights
              position={this.lightPosition}
              lookAt={this.lightTarget} />

            {cubeMeshes}
            {line}
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
