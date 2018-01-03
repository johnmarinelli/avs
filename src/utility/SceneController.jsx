import React from 'react';
import * as dg from 'dis-gui';
import PropTypes from 'prop-types';

const initialSceneState = {
  d: 1,
  sphereColor: { red: 21, green: 98, blue: 137 }
};

class SceneController extends React.Component {

  constructor () {
    super();
    this.state = Object.assign({}, initialSceneState);
  }

  update = (prop, value) => {
    const { state } = this;
    const { onUpdate } = this.props;
    const newData = { ...state, [prop]: value };
    this.setState(newData, () => onUpdate(newData));
  }

  render () {
    const { state } = this;
    const { sphereColor } = state;

    return (
      <dg.GUI>
        <dg.Number label='d' value={state.d} onChange={val => this.update('d', val)} />
        <dg.Color
          label='feels like'
          expanded={true}
          red={sphereColor.red}
          green={sphereColor.green}
          blue={sphereColor.blue}
          onChange={val => this.update('sphereColor', val)} />
      </dg.GUI>
    );
  }
};

SceneController.propTypes = {
  onUpdate: PropTypes.func.isRequired
};

export { initialSceneState };
export default SceneController;
