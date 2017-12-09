import React from 'react';
import './App.css';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import MouseInput from './services/mouse-input';
import AllSpheres from './AllSpheres';
import TrackballControls from './trackball';
import Stats from 'stats-js';

class App extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    const cameraPosition = new THREE.Vector3(0, 0, 1000);
    const cameraRotation = new THREE.Euler();

    this.state = {
      cameraPosition,
      cameraRotation,
      mouseInput: null,
      hovering: false,
      dragging: false
    };

    this._cursor = {
      hovering: false,
      dragging: false
    };

    this.lightPosition = new THREE.Vector3(0, 500, 2000);
    this.lightTarget = new THREE.Vector3(0, 0, 0);
  }

  _onAnimate = () => {
    this._onAnimateInternal();
  };

  componentDidMount () {
    this.stats = new Stats();

    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';

    const {
      container,
      camera
    } = this.refs;

    container.appendChild(this.stats.domElement);

    const controls = new TrackballControls(camera);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = true;

    this.controls = controls;

    this.controls.addEventListener('change', this._onTrackballChange);
  }

  _onTrackballChange = () => {
    this.setState({
      cameraPosition: this.refs.camera.position.clone(),
      cameraRotation: this.refs.camera.rotation.clone()
    });
  };

  _onSpheresMounted = (spheres) => {
    this.spheres = spheres;
  };

  _onHoverStart = () => {
    this.setState({
      hovering: true
    });
  };

  _onHoverEnd = () => {
    this.setState({
      hovering: false
    });
  };

  _onDragStart = () => {
    this.setState({
      dragging: true
    });
  };

  _onDragEnd = () => {
    this.setState({
      dragging: false
    });
  };

  _onAnimateInternal () {
    const {
      mouseInput,
      camera
    } = this.refs;

    if (!mouseInput.isReady()) {
      const {
        scene,
        container
      } = this.refs;

      mouseInput.ready(scene, container, camera);
      mouseInput.restrictIntersections(this.spheres);
      mouseInput.setActive(false);
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

    this.stats.update();
    this.controls.update();
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

  render() {
    const {
      width,
      height 
    } = this.props;

    const {
      cameraPosition,
      cameraRotation,
      mouseInput,
      camera,
      hovering,
      dragging
    } = this.state;

    let style = {};

    if (dragging) {
      style.cursor = 'move';
    } 
    else if (hovering) {
      style.cursor = 'pointer';
    }

    this._cursor.hovering = hovering;
    this._cursor.dragging = dragging;

    return (
      <div
        ref='container'
        style={style}>
        <React3
          mainCamera='camera'
          width={width}
          height={height}
          onAnimate={this._onAnimate}
          antialias
          sortObjects={false}
          pixelRatio={window.devicePixelRatio}
          shadowMapEnabled
          shadowMapType={THREE.PCFShadowMap}
          clearColor={0x0f0f0f} >
          <module
            ref="mouseInput"
            descriptor={MouseInput} />
          <resources>
            <sphereGeometry
              resourceId="sphereGeometry"
              radius={10} />
            <meshBasicMaterial
              resourceId="highlightMaterial"
              color={0xffff00}
              wireframe />
          </resources>
          <scene>
            <perspectiveCamera
              name='camera'
              ref='camera'
              fov={70}
              aspect={width / height}
              near={1}
              far={10000}
              position={cameraPosition} 
              rotation={cameraRotation} />
            <ambientLight
              color={0x505050} />
            <spotLight
              color={0xffffff}
              intensity={1.5}
              position={this.lightPosition}
              lookAt={this.lightTarget}
              castShadow
              shadowCameraNear={200}
              shadowCameraFar={10000}
              shadowCameraFov={50}
              shadowBias={-0.00022}
              shadowMapWidth={2048}
              shadowMapHeight={2048} />
            <AllSpheres
              mouseInput={mouseInput}
              camera={camera}

              onSpheresMounted={this._onSpheresMounted}

              onHoverStart={this._onHoverStart}
              onHoverEnd={this._onHoverEnd}
              onDragStart={this._onDragStart}
              onDragEnd={this._onDragEnd}

              cursor={this._cursor} />
          </scene>
        </React3>
      </div>
    );
  }

  componentWillUnmount () {
    this.controls.removeEventListener('change', this._onTrackballChange);
    this.controls.dispose();
    delete this.controls;
    delete this.stats;
  }
}

export default App;
