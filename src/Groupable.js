const withGroupable = (WrappedComponent) => {
  class WithGroupable extends React.PureComponent {
  };

  WithGroupable.defaultProps = {
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Vector3(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1)

  };
};

export default withGroupable;
