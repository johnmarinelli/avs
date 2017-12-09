class ClickableCube extends React.Component {
  render () {
    return (
      <mesh
        rotation={this.props.rotation} >
        <boxGeometry
          width={1}
          height={1}
          depth={1} />
        <meshBasicMaterial
          color={0x00ff00} />
      </mesh>
    );
  }
};

// to the beat y'all
function withBeat(WrappedComponent, beatDivision) {

  return class extends React.Component {

    componentDidMount () {
      //setTimeout(() => console.log('beep'), 1000.0 / beatDivision);
    }

    render () {
      return <WrappedComponent {...this.props} />;
    }
  };
}
