import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

class Sphere extends React.PureComponent {

  constructor (props, context) {
    super(props, context);

    this.rotation = new THREE.Euler(
      0, 
      0, 
      0
    );

    this.scale = new THREE.Vector3(
      1,
      1,
      1
    );

    this.color = new THREE.Color(Math.random() * 0xffffff);

    const hsl = this.color.getHSL();

    hsl.s = Math.min(1.0, hsl.s * 1.1);
    hsl.l = Math.min(1.0, hsl.l * 1.1);

    const { h, s, l } = hsl;

    this.hoverColor = new THREE.Color().setHSL(h, s, l);

    const {
      position
    } = props;


    this.state = {
      position
    };
  }

  componentWillUnmount () {
    document.removeEventListener('mouseup', this._onDocumentMouseUp);
  }

  _ref = (mesh) => {
    const {
      onCreate
    } = this.props;

    onCreate(mesh);
  };

  render () {
    const {
      rotation,
      scale
    } = this;

    const {
      cursor: {
        dragging
      },
      pressed,
      pressedColor,
      hovered,
      position,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      hoverHighlightMesh,
      geometry
    } = this.props;

    /*
    const geometry = 
      <sphereGeometry
        widthSegments={32}
        heightSegments={32}
        radius={radius} />;
    */

    let color = this.color;

    if (pressed) {
      color = pressedColor;
    }
    else if (null !== hoverHighlightMesh) {
      color = this.hoverColor;
    }

    return (
      <group
        position={position}
        rotation={rotation}
        scale={scale}>
        <mesh
          castShadow
          receiveShadow

          onMouseEnter={onMouseEnter}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}

          ref={this._ref}>
          {geometry}
          <meshLambertMaterial 
            color={color} />
        </mesh>
        {hoverHighlightMesh}
      </group>
        
    );
  }
};

Sphere.PropTypes = {
  position: PropTypes.instanceOf(THREE.Vector3).isRequired,

  camera: PropTypes.instanceOf(THREE.PerspectiveCamera),

  onCreate: PropTypes.func.isRequired,

  cursor: PropTypes.any

};

export default Sphere;
