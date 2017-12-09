import React from 'react';
import DraggableSphere from './DraggableSphere';
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

    const sphereGeometries = [{
      position: new THREE.Vector3(
        0,
        0,
        0
      ),
      radius: 500
    }];
    sphereGeometries.length = 1;

    const spheres = [];
    spheres.length = sphereGeometries.length;
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

      return (
        <DraggableSphere
          key={index}

          mouseInput={mouseInput}
          camera={camera}

          position={position}
          radius={radius}
          onCreate={onCreate}
          onMouseEnter={this._onSphereMouseEnter}
          onMouseLeave={this._onSphereMouseLeave}
          onDragStart={this._onSphereDragStart}
          onDragEnd={this._onSphereDragEnd}

          cursor={cursor}
        />
      );
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
