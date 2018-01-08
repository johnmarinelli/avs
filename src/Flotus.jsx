import React from 'react';
import React3 from 'react-three-renderer';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import Stats from 'stats-js';

import MouseInput from './services/mouse-input';
import TrackballControls from './services/trackball';
import Resources from './Resources';
import Lights from './Lights';
import Camera from './Camera';

import Palette from './Palette';

import ParticleSystem from './ParticleSystem';

import { createPerspectiveMatrix } from './utility/MatrixUtility';

class Flotus extends React.Component {
  getMeshStates () {
    const { boidSystem: { position, rotation } } = this.state;

    return {
      position: position.clone(),
      rotation: rotation.clone()
    };
  }

  constructor (props, context) {
    super(props, context);

    const {
      width,
      height
    } = props;

    this.fog = new THREE.Fog(Palette.background, 10, 40);
    this.fov = 30.0;
    this.aspectRatio = width / height;
    this.near = 1.0;
    this.far = 10000.0;

    this.perspectiveMatrix = createPerspectiveMatrix(this.near, this.far, this.fov, this.aspectRatio);

    console.log(this.perspectiveMatrix);
    this.cameraName = "camera";

    this.lightPosition = new THREE.Vector3(20, 20, 20);
    this.lightTarget = new THREE.Vector3(0, 0, 0);

    const cameraPosition = new THREE.Vector3(0, 2, -5);
    const cameraRotation = new THREE.Euler();

    this.state = {
      cameraPosition,
      cameraRotation,
      mouseInput: null,
      boidSystem: {
        position: new THREE.Vector3(),
        rotation: new THREE.Euler()
      },
      meshStates: null
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
    try {
      this.onAnimateInternal();

      this.updatePhysics();
      this.updateGraphics();
      this.stats.update();
      this.controls.update();
    } catch (err) {
      debugger
    }
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
      mouseInput.restrictIntersections([]);
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
    const t = Date.now() * 0.005;
    const rz = 0.01 * t;

    const { boidSystem } = this.state;
    const { rotation } = boidSystem;

    const newRotation = rotation.clone().set(rotation.x, rotation.y, rz);
    let newPosition = boidSystem.position.clone();

    if (this.refs.mouseInput.isReady() && this.state.camera) {
      const { boidSystem, camera } = this.state;
      let { _mouse: { x, y } } = this.refs.mouseInput;

      x = (x / window.innerWidth) * 2 - 1;
      y = -(y / window.innerHeight) * 2 + 1;
      let vec = new THREE.Vector3(x, y, 0.5);
      vec.unproject(camera);
      let dir = vec.sub(camera.position).normalize();
      let dis = -camera.position.z / dir.z;
      newPosition = camera.position.clone().add(dir.multiplyScalar(dis));
    }

    this.setState({
      boidSystem: {
        ...boidSystem,
        position: newPosition,
        //rotation: newRotation
      }
    });
  }

  updateGraphics () {
    this.setState({
      meshStates: this.getMeshStates()
    });
  }

  onDragStart = (newPos, i) => {
  };

  onDragEnd = (newPos, i) => {
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
      cameraPosition,
      cameraRotation,
      camera,
      mouseInput,
      boidSystem
    } = this.state;

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
              fov={this.fov}
              near={this.near}
              far={this.far}
              aspect={this.aspectRatio}
              position={cameraPosition}
              rotation={cameraRotation}
              setRef={this.setCameraRef.bind(this)} />

            <Lights
              position={this.lightPosition}
              lookAt={this.lightTarget} />

            <pointLight
              position={boidSystem.position} />

            <mesh
              position={new THREE.Vector3(1, 1, 1)}
              rotation={new THREE.Euler(45, 0, 45)}>
              <geometryResource
                resourceId="cube" />
              <materialResource
                resourceId="greyPhongMaterial" />
            </mesh>

            <mesh
              position={new THREE.Vector3(-1, -1, 1)}
              rotation={new THREE.Euler(45, 45, 45)}>
              <geometryResource
                resourceId="icosahedron" />
              <materialResource
                resourceId="greyLambertMaterial" />
            </mesh>

            <ParticleSystem
              particleCount={40000} />
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

export default Flotus;
