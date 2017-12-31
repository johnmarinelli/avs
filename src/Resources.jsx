import React from 'react';

class Resources extends React.Component {
  render () {
    return (
      <resources>
        <boxGeometry
          resourceId="cube"

          width={0.5}
          height={0.5}
          depth={0.5}

          widthSegments={10}
          heightSegments={10} />

        <lineBasicMaterial
          resourceId="lineMaterial"
          color={0xff00ff} />

        <meshPhongMaterial
          resourceId="cubeMaterial"
          color={0x888888} />

        <meshBasicMaterial
          resourceId="highlightMaterial"
          color={0xffff00}
          wireframe />
      </resources>
    );
  }
};

export default Resources;
