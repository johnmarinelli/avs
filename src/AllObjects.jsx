import React from 'react';
import { withHoverable, withDraggable  } from './enhancers';
import * as THREE from 'three';
import Entity from './Entity';
import Compose from './Compose';
import ObjectDefinition from './ObjectDefinition';

import PropTypes from 'prop-types';

import MouseInput from './services/mouse-input';

class AllObjects extends React.PureComponent {

  constructor(props, context) {
    super(props, context);

    const o = new ObjectDefinition({
        position: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
        rotation: new THREE.Euler(0, 0, 0),
        color: new THREE.Color(Math.random() * 0xffffff),
      }
    );
    o.updateCb = function (ms) {
      this.position.x += ms * 100;
    }.bind(o);

    this.entities = [
      o
    ];

    this.objects = new Array(this.entities.length);

    this._hoveredObjects = 0;
    this._draggingObjects = 0;

    this.HoverableDraggableEntity = Compose(
      withDraggable,
      withHoverable
    )(Entity);
  }

  componentDidMount() {
    const {
      onObjectsMounted,
    } = this.props;

    onObjectsMounted(this.objects);
  }

  _onSphereCreate = (index, sphere) => {
    this.objects[index] = sphere;
  };

  _onSphereMouseEnter = () => {
    if (this._hoveredObjects === 0) {
      const {
        onHoverStart,
      } = this.props;

      onHoverStart();
    }

    this._hoveredObjects++;
  };

  _onSphereMouseLeave = () => {
    this._hoveredObjects--;

    if (this._hoveredObjects === 0) {
      const {
        onHoverEnd,
      } = this.props;

      onHoverEnd();
    }
  };

  _onSphereDragStart = () => {
    if (this._draggingObjects === 0) {
      const {
        onDragStart,
      } = this.props;

      onDragStart();
    }

    this._draggingObjects++;
  };

  _onSphereDragEnd = () => {
    this._draggingObjects--;

    if (this._draggingObjects === 0) {
      const {
        onDragEnd,
      } = this.props;

      onDragEnd();
    }
  };

  _pyramid = () => {
    const position = new THREE.Vector3(0, 0, 0);
    const scale = new THREE.Vector3(1, 1, 1);
    const rotation = new THREE.Euler(0, 0, 0);

    const geometry =
      <cylinderGeometry
        radiusTop={1}
        radiusBottom={10}
        height={10}
        radialSegments={4} />;

      const material =
        <meshLambertMaterial
          color={0xff00ff} />;

    return (
      <Entity
        material={material}
        geometry={geometry}

        scale={scale}
        rotation={rotation}
        position={position} />
    );
  };

  renderObjects () {
    const {
      mouseInput,
      camera,
      cursor,
      delta
    } = this.props;

    return this.entities.map((objDefinition, index) => {
      const onCreate = this._onSphereCreate.bind(this, index);
      const {
        position,
        scale,
        rotation,
        color
      } = objDefinition;

      const radius = 10;

      const sphereGeometryElement =
        <sphereGeometry
          widthSegments={32}
          heightSegments={32}
          radius={radius} />;

      const sphereMaterialElement =
          <meshLambertMaterial
            color={color} />;

      const { HoverableDraggableEntity }= this;
      const sphere =
        <HoverableDraggableEntity
          key={index}
          onCreate={onCreate}
          material={sphereMaterialElement}
          geometry={sphereGeometryElement}
          onMouseEnter={this._onSphereMouseEnter}
          onMouseLeave={this._onSphereMouseLeave}
          onDragStart={this._onSphereDragStart}
          onDragEnd={this._onSphereDragEnd}

          cursor={cursor}
          camera={camera}
          mouseInput={mouseInput}

          scale={scale}
          rotation={rotation}
          position={position} />;

      return sphere;
    });
  }

  render() {
    const objects = this.renderObjects();
    const pyramid = this._pyramid();

    return (
      <group>
        {objects}
      </group>
    );
  }
}
AllObjects.propTypes = {
  mouseInput: PropTypes.instanceOf(MouseInput),
  camera: PropTypes.instanceOf(THREE.PerspectiveCamera),
  delta: PropTypes.number,

  onObjectsMounted: PropTypes.func.isRequired,
  onHoverStart: PropTypes.func.isRequired,
  onHoverEnd: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,

  cursor: PropTypes.any,
};

export default AllObjects;
