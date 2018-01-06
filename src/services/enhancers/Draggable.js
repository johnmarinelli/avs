import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import getDisplayName from 'react-display-name';

import MouseInput from '../mouse-input';

// shared plane for dragging purposes
// it's good to share because you can drag only one cube at a time
const dragPlane = new THREE.Plane();
const backVector = new THREE.Vector3(0, 0, -1);

const withDraggable = (WrappedComponent) => {
  class WithDraggable extends React.Component {

    constructor (props) {
      super();
      const { position } = props;
      this.state = {
        position: position
      };
    }

    componentWillReceiveProps (newProps) {
      if (!this.state.pressed) {
        this.setState({position: newProps.position});
      }
    }

    _onDocumentMouseUp = (event) => {
      event.preventDefault();

      document.removeEventListener('mouseup', this._onDocumentMouseUp);
      document.removeEventListener('mousemove', this._onDocumentMouseMove);

      const {
        position
      } = this.state;

      const {
        onDragEnd,
        index
      } = this.props;

      onDragEnd(position, index);

      this.setState({
        pressed: false
      });

    };

    _onMouseDown = (event, intersection) => {
      event.preventDefault();
      event.stopPropagation();

      const {
        position
      } = this.state;

      const {
        onDragStart,
        camera,
        index
      } = this.props;

      dragPlane.setFromNormalAndCoplanarPoint(
        backVector.clone().applyQuaternion(camera.quaternion),
        intersection.point
      );

      const offset = intersection.point.clone().sub(position);
      this._offset = offset;

      document.addEventListener('mouseup', this._onDocumentMouseUp);
      document.addEventListener('mousemove', this._onDocumentMouseMove);

      this.setState({
        pressed: true
      });

      onDragStart(position, index);
    };

    _onDocumentMouseMove = (event) => {
      event.preventDefault();

      const {
        mouseInput
      } = this.props;

      const ray:THREE.Ray = mouseInput.getCameraRay(
        new THREE.Vector2(event.clientX, event.clientY)
      );

      const intersection = dragPlane.intersectLine(
        new THREE.Line3(
          ray.origin,
          ray.origin.clone().add(ray.direction.clone().multiplyScalar(10000))
        )
      );

      if (intersection) {
        this.setState({
          position: intersection.sub(this._offset),
        });
      };
    };

    render () {
      const {
        onDragStart,
        onDragEnd,
        ...passThroughProps
      } = this.props;

      const {
        position,
        pressed
      } = this.state;

      let childProps = Object.assign(
        {},
        passThroughProps,
        {
          withDraggable: {
            pressed,
            onMouseDown: this._onMouseDown
          }
        }
      );

      if (pressed) {
        childProps.position = position;
      }

      return (
        <WrappedComponent
          {...childProps} />
      );
    }

    componentWillUnmount () {
      document.removeEventListener('mouseup', this._onDocumentMouseUp);
    }

  };

  WithDraggable.PropTypes = {
    mouseInput: PropTypes.instanceOf(MouseInput).isRequired,
    camera: PropTypes.object.isRequired,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    pressedColor: PropTypes.any
  };

  WithDraggable.defaultProps = {
    onDragStart: () => {},
    onDragEnd: () => {},
    pressedColor: 0x00ff00
  };

  WithDraggable.displayName =
   `WithDraggable (${getDisplayName(WrappedComponent)})`;

  return WithDraggable;
};

export default withDraggable;
