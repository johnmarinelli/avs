import React from 'react';
import DeformedBall from './DeformedBall';
import SceneController, { initialSceneState } from './utility/SceneController';

class Main extends React.Component {

  constructor () {
    super();
    this.state = {
      sceneData: Object.assign({}, initialSceneState)
    }
  }

  updateSceneData = (sceneData) => {
    this.setState({ sceneData })
  }

  render () {
    const { sceneData } = this.state;

    return (
      <div>
        <SceneController onUpdate={this.updateSceneData} />
        <DeformedBall
          width={window.innerWidth}
          height={window.innerHeight}
          sceneData={sceneData}
        />
      </div>
    );
  }
};

export default Main;
