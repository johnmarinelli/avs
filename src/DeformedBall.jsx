import React from 'react';
import React3 from 'react-three-renderer';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import Stats from 'stats-js';

import MouseInput from './services/mouse-input';
import TrackballControls from './services/trackball';
import Sphere from './actors/Sphere';
import Resources from './wardrobe/Resources';
import Lights from './decorations/Lights';
import Camera from './utility/Camera';

class DeformedBall extends React.Component {
  getMeshStates () {
    return {
      protagonist: {
        rotation: this.bodies.protagonist.rotation.clone(),
        position: this.bodies.protagonist.position.clone()
      }
    };
  }

  constructor (props, context) {
    super(props, context);

    this.fog = new THREE.Fog(0x001525, 10, 40);
    this.cameraName = "camera";

    this.lightPositions = [
      new THREE.Vector3(0, 200, 0),
      new THREE.Vector3(100, 200, 100),
      new THREE.Vector3(-100, -200, -100)
    ];

    const cameraPosition = new THREE.Vector3(0, 10, 30);
    const cameraRotation = new THREE.Euler();

    this.bodies = {
      protagonist: {
        rotation: new THREE.Euler(0, 0, 0),
        position: new THREE.Vector3(0, 0, 0)
      }
    };

    this.state = {
      cameraPosition,
      cameraRotation,
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
    const { bodies: { protagonist } } = this;
    const { rotation } = protagonist;
    const { x, y, z } = rotation;

    /*
    this.bodies
      .protagonist
      .rotation
      .set(x + 0.005, y + 0.005, 0);
      */
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
      cameraPosition,
      cameraRotation,
      camera,
      mouseInput,
      meshStates
    } = this.state;

    const sphere = (
      <Sphere
        time={new Date().getTime()}
        rotation={meshStates.protagonist.rotation}
        position={meshStates.protagonist.position} />
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
              positions={this.lightPositions} />

            {sphere}

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

export default DeformedBall;
