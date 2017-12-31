import React from 'react';
import PropTypes from 'prop-types';
import getDisplayName from 'react-display-name';

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

    }

    _onMouseLeave = () => {
      if (this.state.hovered) {
        this.setState({
          hovered: false
        });
      }
    };

    render () {
      const { hovered } = this.state;

      const hoverHighlightMesh = hovered ?
        this.hoverHighlightMesh :
        null;

      const childProps = Object.assign(
        {},
        this.props,
        {
          withHoverable: {
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave,
            hovered,
            hoverHighlightMesh
          }
        }
      );

      return (
        <WrappedComponent
          {...childProps} />
      );
    }
  };

  WithHoverable.PropTypes = {
    geometry: PropTypes.element.isRequired,
    cursor: PropTypes.any
  };

  WithHoverable.displayName =
    `WithHoverable (${getDisplayName(WrappedComponent)})`;

  return WithHoverable;

};

export default withHoverable;
