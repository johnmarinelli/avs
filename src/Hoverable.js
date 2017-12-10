import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import getDisplayName from 'react-display-name';

import MouseInput from './services/mouse-input';

const withHoverable = (WrappedComponent) => {
  class WithHoverable extends React.PureComponent {
    constructor (props) {
      super(props);
      const { geometry } = this.props;
      this.state = {
        hovered: false
      };

      this.hoverHighlightMesh = (
        <mesh
          ignorePointerEvents>
          {geometry}
          <materialResource
            resourceId="highlightMaterial" />
        </mesh> 
      );
    }

    _onMouseEnter = () => {
      this.setState({
        hovered: true
      });

      const { onMouseEnter } = this.props;

      onMouseEnter();
    }

    _onMouseLeave = () => {
      if (this.state.hovered) {
        this.setState({
          hovered: false
        });

        const {
          onMouseLeave
        } = this.props;

        onMouseLeave();
      }
    };

    render () {
      const { 
        onMouseEnter, 
        onMouseLeave, 
        ...passThroughProps,
      } = this.props;
      const { hovered } = this.state;
      const dragging = this.props.cursor.dragging;

      const hoverHighlight = (hovered && !dragging);
      const hoverHighlightMesh = hoverHighlight ? 
        this.hoverHighlightMesh :
        null;

      const childProps = Object.assign(
        {}, 
        passThroughProps, 
        { 
          hovered ,
          hoverHighlightMesh
        });

      return (
        <WrappedComponent
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
          {...childProps} />
      );
    }
  };

  WithHoverable.PropTypes = {
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    geometry: PropTypes.element,
    cursor: PropTypes.any
  };
  
  WithHoverable.displayName = 
    `WithHoverable (${getDisplayName(WrappedComponent)})`;

  return WithHoverable;

};

export default withHoverable;
