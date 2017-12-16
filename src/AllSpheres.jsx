import React from 'react';
import WithHoverable from './Hoverable';
import WithDraggable from './Draggable';
import Group from './Group';
import Mesh from './Mesh';
import Compose from './Compose';
import * as THREE from 'three';

import PropTypes from 'prop-types';

import MouseInput from './services/mouse-input';

class AllSpheres extends React.PureComponent {
  static propTypes = {
    mouseInput: PropTypes.instanceOf(MouseInput),
    camera: PropTypes.instanceOf(THREE.PerspectiveCamera),

    onSpheresMounted: PropTypes.func.isRequired,
    onHoverStart: PropTypes.func.isRequired,
    onHoverEnd: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,

    cursor: PropTypes.any,
  };

  constructor(props, context) {
    super(props, context);

    const numSpheres = 10;

    let sphereGeometries = new Array(numSpheres);

    for (let i = 0; i < 10; ++i) {
      const position = new THREE.Vector3(
        Math.random() * 100.0,
        Math.random() * 100.0,
        Math.random() * 50.0
      );

      const radius = Math.random() * 10.0;

      sphereGeometries[i] = {
        position,
        radius,
      };
    };

    const spheres = new Array(numSpheres);
    this.spheres = spheres;

    this.sphereGeometries = sphereGeometries;

    this._hoveredSpheres = 0;
    this._draggingSpheres = 0;

  }

  componentDidMount() {
    const {
      onSpheresMounted,
    } = this.props;

    onSpheresMounted(this.spheres);
  }

  _onSphereCreate = (index, sphere) => {
    this.spheres[index] = sphere;
  };

  _onSphereMouseEnter = () => {
    if (this._hoveredSpheres === 0) {
      const {
        onHoverStart,
      } = this.props;

      onHoverStart();
    }

    this._hoveredSpheres++;
  };

  _onSphereMouseLeave = () => {
    this._hoveredSpheres--;

    if (this._hoveredSpheres === 0) {
      const {
        onHoverEnd,
      } = this.props;

      onHoverEnd();
    }
  };

  _onSphereDragStart = () => {
    if (this._draggingSpheres === 0) {
      const {
        onDragStart,
      } = this.props;

      onDragStart();
    }

    this._draggingSpheres++;
  };

  _onSphereDragEnd = () => {
    this._draggingSpheres--;

    if (this._draggingSpheres === 0) {
      const {
        onDragEnd,
      } = this.props;

      onDragEnd();
    }
  };

  renderSpheres () {
    const {
      mouseInput,
      camera,
      cursor,
    } = this.props;

    return this.sphereGeometries.map((sphereGeometry, index) => {
      const onCreate = this._onSphereCreate.bind(this, index);
      const {
        position,
        radius
      } = sphereGeometry;

      const rotation = new THREE.Euler(0, 0, 0);
      const scale = new THREE.Vector3(1, 1, 1);

      const color= new THREE.Color(Math.random() * 0xffffff);

      const sphereGeometryElement =
        <sphereGeometry
          widthSegments={32}
          heightSegments={32}
          radius={radius} />;

      const sphereMaterialElement =
          <meshLambertMaterial
            color={color} />;

      const sphereMeshElement =
        <Mesh
          onCreate={onCreate}
          material={sphereMaterialElement}
          geometry={sphereGeometryElement} />;

      const HoverableDraggableMesh = Compose(
        WithDraggable,
        WithHoverable
      )(Mesh);

      const sphereGroup =
        <HoverableDraggableMesh
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
          position={position}>
        </HoverableDraggableMesh>;
      return sphereGroup;
    });
  }

  render() {
    const spheres = this.renderSpheres();

    return (
      <group>
        {spheres}
      </group>
    );
  }
}

export default AllSpheres;
